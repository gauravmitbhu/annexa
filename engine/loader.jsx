// Boot loader — fetches the site spec, data records, and widget sources
// discovered via /api/manifest, then renders the App shell.
//
// Load order: site.json → all data/*.json (each file is an object whose keys
// become window globals) → each widgets/*.jsx (Babel-transformed and evaluated
// in global scope, per-file try/catch so one broken widget never white-screens
// the app) → render.
(async function boot() {
  const rootEl = document.getElementById('root');
  const fail = (msg) => {
    rootEl.innerHTML = '<div style="padding:60px;font-family:Poppins,sans-serif;color:#B91C1C">' +
      '<h2 style="margin:0 0 8px">Failed to boot</h2><pre style="white-space:pre-wrap;font-size:12px">' +
      String(msg).replace(/</g, '&lt;') + '</pre></div>';
  };

  let manifest;
  try {
    manifest = await (await fetch('/api/manifest')).json();
  } catch (e) { return fail('Could not load /api/manifest — is app.py running?\n' + e); }

  try {
    window.SITE = await (await fetch(manifest.site + '?t=' + Date.now())).json();
  } catch (e) { return fail('site/site.json is missing or invalid JSON:\n' + e); }

  // Theme (optional): site/theme.json overrides the --brand-* tokens.
  try {
    const r = await fetch('site/theme.json?t=' + Date.now());
    window.THEME = r.ok ? await r.json() : null;
  } catch (e) { window.THEME = null; }
  window.applyTheme(window.THEME);
  document.title = ((window.SITE.brand || {}).legalName || (window.SITE.brand || {}).name || 'annexa') + ' — IMS Dashboard';

  // Data: every data/*.json is { GLOBAL_NAME: value, ... } merged onto window.
  for (const path of manifest.data || []) {
    try {
      Object.assign(window, await (await fetch(path + '?t=' + Date.now())).json());
    } catch (e) {
      window.__WIDGET_ERRORS.push({ file: path, error: 'invalid JSON: ' + e.message });
    }
  }
  window.NAV = (window.SITE && window.SITE.nav) || [];  // back-compat global

  // Widgets: evaluate each file independently; record failures for fallback UI.
  for (const path of manifest.widgets || []) {
    try {
      const src = await (await fetch(path + '?t=' + Date.now())).text();
      const { code } = Babel.transform(src, { presets: ['react'], filename: path });
      // Indirect eval does NOT persist top-level const/let into the global
      // lexical environment (script tags do). Widgets share top-level consts
      // across files, so promote them to var → global object properties.
      const globalized = code.replace(/^(const|let) /gm, 'var ');
      (0, eval)(globalized);
    } catch (e) {
      window.__WIDGET_ERRORS.push({ file: path, error: e.message });
      console.error('[loader] widget failed:', path, e);
    }
  }

  try {
    ReactDOM.createRoot(rootEl).render(React.createElement(window.App));
  } catch (e) { return fail('Renderer crashed:\n' + (e.stack || e)); }
})();

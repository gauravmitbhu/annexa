// Whitelabel theme — maps a theme object (site/theme.json, or a live preview
// from the Settings page) onto the --brand-* CSS variables every widget uses.
// applyTheme(null) restores the defaults from colors_and_type.css.
(function () {
  const VARS = {
    accent: '--brand-accent', accent2: '--brand-accent-2', accentDark: '--brand-accent-dark',
    ink: '--brand-ink', muted: '--brand-muted', surface: '--brand-surface',
    border: '--brand-border', onAccent: '--brand-on-accent',
  };
  // Fonts that are bundled or system-installed; anything else is requested
  // from Google Fonts and silently falls back if it is not hosted there.
  const LOCAL_FONTS = ['poppins', 'inter var', 'system-ui', 'arial', 'helvetica', 'segoe ui'];

  function loadFont(name) {
    if (!name || LOCAL_FONTS.includes(name.toLowerCase())) return;
    const id = 'font-' + name.replace(/\W+/g, '-').toLowerCase();
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' +
      encodeURIComponent(name).replace(/%20/g, '+') + ':wght@300;400;500;600;700;800&display=swap';
    document.head.appendChild(link);
  }

  function setFavicon(href) {
    let el = document.querySelector('link[rel="icon"]');
    if (!el) { el = document.createElement('link'); el.rel = 'icon'; document.head.appendChild(el); }
    if (!el.dataset.fallback) el.dataset.fallback = el.href;
    el.href = href || el.dataset.fallback;
  }

  function applyTheme(theme) {
    const root = document.documentElement.style;
    const colors = (theme && theme.colors) || {};
    Object.entries(VARS).forEach(([k, v]) => colors[k] ? root.setProperty(v, colors[k]) : root.removeProperty(v));

    const fonts = (theme && theme.fonts) || {};
    const stack = (f) => `'${f}', 'Poppins', ui-sans-serif, system-ui, sans-serif`;
    if (fonts.body) { loadFont(fonts.body); root.setProperty('--font-body', stack(fonts.body)); }
    else root.removeProperty('--font-body');
    if (fonts.display) { loadFont(fonts.display); root.setProperty('--font-display', stack(fonts.display)); }
    else root.removeProperty('--font-display');

    setFavicon(theme && theme.favicon);
    window.THEME_LIVE = theme || null;
    window.dispatchEvent(new CustomEvent('theme:changed', { detail: theme }));
  }

  window.applyTheme = applyTheme;
})();

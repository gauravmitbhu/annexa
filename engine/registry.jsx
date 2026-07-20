// Widget registry — the contract between the protected engine and the
// evolvable widgets/ layer. A widget file defines a component and calls
// registerWidget('name', Component); the renderer resolves names from
// site/site.json against this registry at render time.
window.WIDGETS = window.WIDGETS || {};
window.__WIDGET_ERRORS = [];

function registerWidget(name, component) {
  window.WIDGETS[name] = component;
}

// Resolve a widget by name; returns null when missing so the renderer can
// show a fallback card instead of crashing.
function getWidget(name) {
  return window.WIDGETS[name] || null;
}

// Interpolate {expr} templates in site.json strings against globals,
// e.g. "{CONTROLS.length} controls in scope". Errors render as ''.
function tpl(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/\{([^{}]+)\}/g, (_, expr) => {
    try { return String(new Function(`return (${expr})`)()); }
    catch (e) { return ''; }
  });
}

Object.assign(window, { registerWidget, getWidget, tpl });

/**
 * Manage removable theme styles without storage or network activity on import.
 * @param {{root?: HTMLElement, document?: Document, baseUrl?: string}} options
 */
export function createThemeManager({
  root = document.documentElement,
  document: targetDocument = document,
  baseUrl = targetDocument.baseURI
} = {}) {
  const themes = new Map();

  function register(manifest) {
    if (!manifest || !/^[a-z][a-z0-9-]*$/.test(manifest.id || '') || !Array.isArray(manifest.styles) || !Array.isArray(manifest.modes)) {
      throw new TypeError('Invalid PWF theme manifest.');
    }
    themes.set(manifest.id, Object.freeze({ removable: true, ...manifest }));
    return manifest.id;
  }

  function apply(id) {
    const theme = themes.get(id);
    if (!theme) throw new Error(`Unknown PWF theme: ${id}`);
    targetDocument.querySelectorAll('link[data-pwf-theme-style]').forEach((link) => {
      if (link.dataset.pwfThemeStyle !== id) link.remove();
    });
    theme.styles.forEach((style) => {
      const absolute = new URL(style, baseUrl).href;
      if (targetDocument.querySelector(`link[data-pwf-theme-style="${id}"][href="${absolute}"]`)) return;
      const link = targetDocument.createElement('link');
      link.rel = 'stylesheet';
      link.href = absolute;
      link.dataset.pwfThemeStyle = id;
      targetDocument.head.append(link);
    });
    root.dataset.pwfTheme = id;
    root.dispatchEvent(new CustomEvent('pwf:theme-change', { detail: { id, manifest: theme } }));
    return theme;
  }

  function remove(id) {
    if (root.dataset.pwfTheme === id) throw new Error(`Apply another PWF theme before removing ${id}.`);
    targetDocument.querySelectorAll(`link[data-pwf-theme-style="${id}"]`).forEach((link) => link.remove());
    return themes.delete(id);
  }

  return Object.freeze({ register, apply, remove, get: (id) => themes.get(id) || null, list: () => [...themes.values()] });
}

/**
 * Resolve an application's requested color scheme against a theme manifest.
 * Single-mode themes are intentionally locked to their historical appearance.
 * @param {{modes?: string[]}} manifest
 * @param {'auto'|'light'|'dark'} [requested='auto']
 */
export function getThemeModeState(manifest, requested = 'auto') {
  const supported = [...new Set((manifest?.modes || ['light', 'dark']).filter((mode) => mode === 'light' || mode === 'dark'))];
  if (!supported.length) throw new TypeError('A PWF theme must support light or dark mode.');
  const normalized = ['auto', 'light', 'dark'].includes(requested) ? requested : 'auto';
  const locked = supported.length === 1;
  const resolved = locked ? supported[0] : (normalized === 'auto' || supported.includes(normalized) ? normalized : supported[0]);
  return Object.freeze({ requested: normalized, resolved, locked, supported: Object.freeze(supported) });
}

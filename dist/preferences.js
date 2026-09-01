const COLOR_SCHEMES = new Set(['auto', 'light', 'dark']);
const CONTRASTS = new Set(['auto', 'standard', 'more']);
const MOTIONS = new Set(['auto', 'full', 'reduce']);

export const DEFAULT_PREFERENCES = Object.freeze({
  colorScheme: 'auto',
  contrast: 'auto',
  motion: 'auto',
  scale: 1
});

/** Normalize untrusted preference input into the stable PWF contract. */
export function normalizePreferences(value = {}) {
  const scale = Number(value.scale);
  return {
    colorScheme: COLOR_SCHEMES.has(value.colorScheme) ? value.colorScheme : DEFAULT_PREFERENCES.colorScheme,
    contrast: CONTRASTS.has(value.contrast) ? value.contrast : DEFAULT_PREFERENCES.contrast,
    motion: MOTIONS.has(value.motion) ? value.motion : DEFAULT_PREFERENCES.motion,
    scale: Number.isFinite(scale) ? Math.min(1.5, Math.max(0.75, scale)) : DEFAULT_PREFERENCES.scale
  };
}

/** Apply preferences to a document root without writing cookies or storage. */
export function applyPreferences(value, root = document.documentElement) {
  const preferences = normalizePreferences(value);
  root.dataset.pwfColorScheme = preferences.colorScheme;
  root.dataset.pwfContrast = preferences.contrast;
  root.dataset.pwfMotion = preferences.motion;
  root.style.setProperty('--pwf-ui-scale', String(preferences.scale));
  return preferences;
}

/**
 * Create an opt-in persistence controller.
 * The storage object only needs getItem/setItem/removeItem methods.
 */
export function createPreferenceController({
  root = document.documentElement,
  storage = null,
  storageKey = 'pwf.preferences'
} = {}) {
  function read() {
    if (!storage) return { ...DEFAULT_PREFERENCES };
    try {
      return normalizePreferences(JSON.parse(storage.getItem(storageKey) || '{}'));
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  function set(value, { persist = Boolean(storage) } = {}) {
    const next = applyPreferences({ ...read(), ...value }, root);
    if (persist && storage) storage.setItem(storageKey, JSON.stringify(next));
    return next;
  }

  function clear() {
    if (storage) storage.removeItem(storageKey);
    return applyPreferences(DEFAULT_PREFERENCES, root);
  }

  return { read, set, clear, apply: () => applyPreferences(read(), root) };
}

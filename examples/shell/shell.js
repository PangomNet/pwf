import { PWF_VERSION, applyPreferences, createThemeManager, getThemeModeState, initLaunchers, initPwf, openDialog } from '../../dist/pwf.js';
import { SHOWCASE_THEMES } from './themes.js';

initPwf();

let launcherStorage = null;
try { launcherStorage = window.localStorage; } catch { /* The launcher also works in memory. */ }
initLaunchers(document, { storage: launcherStorage, storageKey: 'pwf-showcase-pins' });

document.querySelectorAll('[data-pwf-version]').forEach((output) => {
  output.textContent = PWF_VERSION;
});

const root = document.documentElement;
const app = document.querySelector('.pwf-app');
const themeManager = createThemeManager({ root, document, baseUrl: import.meta.url });
SHOWCASE_THEMES.forEach((theme) => themeManager.register(theme));
const linkedThemeId = new URLSearchParams(window.location.search).get('theme');
if (linkedThemeId && themeManager.get(linkedThemeId)) themeManager.apply(linkedThemeId);
const preferences = {
  colorScheme: root.dataset.pwfColorScheme || 'auto',
  contrast: root.dataset.pwfContrast || 'auto',
  motion: root.dataset.pwfMotion || 'auto',
  scale: Number.parseFloat(getComputedStyle(root).getPropertyValue('--pwf-ui-scale')) || 1
};
let requestedColorScheme = preferences.colorScheme;

function syncControls(selector, value, source) {
  document.querySelectorAll(selector).forEach((control) => {
    if (control !== source) control.value = value;
  });
}

document.querySelectorAll('[data-shell-theme]').forEach((control) => {
  const groups = new Map();
  control.replaceChildren();
  SHOWCASE_THEMES.forEach((theme) => {
    if (!groups.has(theme.category)) {
      const group = document.createElement('optgroup');
      group.label = theme.category === 'core' ? 'PWF Core' : theme.category === 'seasonal' ? 'Saisonal' : theme.category === 'media' ? 'Media' : theme.category === 'artwork' ? 'Artwork' : theme.category === 'legacy' ? 'PanPlay Archiv' : 'Marke';
      groups.set(theme.category, group);
      control.append(group);
    }
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.name;
    groups.get(theme.category).append(option);
  });
  control.value = root.dataset.pwfTheme || 'standard';
  control.addEventListener('change', (event) => {
    const theme = themeManager.apply(event.target.value);
    applyThemeMode(theme);
    syncControls('[data-shell-theme]', event.target.value, event.target);
  });
});

function applyThemeMode(theme) {
  const state = getThemeModeState(theme, requestedColorScheme);
  preferences.colorScheme = state.resolved;
  applyPreferences(preferences, root);
  root.dataset.pwfThemeMode = state.locked ? 'fixed' : 'adaptive';
  document.querySelectorAll('[data-shell-color-scheme]').forEach((control) => {
    control.value = state.resolved;
    control.disabled = state.locked;
    control.setAttribute('aria-description', state.locked
      ? `Dieses Theme besitzt nur die feste ${state.resolved === 'dark' ? 'dunkle' : 'helle'} Originaldarstellung.`
      : 'Das Theme unterstützt helle, dunkle und automatische Darstellung.');
    let hint = control.parentElement?.querySelector('[data-shell-theme-mode-status]');
    if (!hint && control.parentElement) {
      hint = document.createElement('small');
      hint.className = 'pwf-hint';
      hint.dataset.shellThemeModeStatus = '';
      control.insertAdjacentElement('afterend', hint);
    }
    if (hint) hint.textContent = state.locked
      ? `Festes ${state.resolved === 'dark' ? 'dunkles' : 'helles'} Originalschema`
      : 'Automatik sowie Hell und Dunkel verfügbar';
  });
}

document.querySelectorAll('[data-shell-color-scheme]').forEach((control) => {
  control.value = preferences.colorScheme;
  control.addEventListener('change', (event) => {
    requestedColorScheme = event.target.value;
    preferences.colorScheme = getThemeModeState(themeManager.get(root.dataset.pwfTheme), requestedColorScheme).resolved;
    applyPreferences(preferences, root);
    syncControls('[data-shell-color-scheme]', preferences.colorScheme, event.target);
  });
});

applyThemeMode(themeManager.get(root.dataset.pwfTheme || 'standard'));

document.querySelectorAll('[data-shell-scale]').forEach((control) => {
  control.value = String(preferences.scale);
  control.addEventListener('input', (event) => {
    preferences.scale = Number.parseFloat(event.target.value);
    applyPreferences(preferences, root);
    syncControls('[data-shell-scale]', event.target.value, event.target);
  });
});

document.querySelectorAll('[data-shell-contrast]').forEach((control) => {
  control.checked = preferences.contrast === 'more';
  control.addEventListener('change', (event) => {
    preferences.contrast = event.target.checked ? 'more' : 'standard';
    applyPreferences(preferences, root);
    document.querySelectorAll('[data-shell-contrast]').forEach((item) => {
      if (item !== event.target) item.checked = event.target.checked;
    });
  });
});

document.querySelectorAll('[data-shell-motion]').forEach((control) => {
  control.checked = preferences.motion === 'reduce';
  control.addEventListener('change', (event) => {
    preferences.motion = event.target.checked ? 'reduce' : 'full';
    applyPreferences(preferences, root);
    document.querySelectorAll('[data-shell-motion]').forEach((item) => {
      if (item !== event.target) item.checked = event.target.checked;
    });
  });
});

document.querySelectorAll('[data-shell-layout]').forEach((control) => {
  control.value = app?.dataset.pwfLayoutMode || 'normal';
  control.addEventListener('change', (event) => {
    if (app) app.dataset.pwfLayoutMode = event.target.value;
    syncControls('[data-shell-layout]', event.target.value, event.target);
  });
});

const searchDialog = document.getElementById('shell-search');
const searchInput = document.querySelector('[data-shell-search-input]');
const searchStatus = document.querySelector('[data-shell-search-status]');
const searchResults = [...document.querySelectorAll('[data-shell-search-result]')];

function updateSearch() {
  if (!searchInput || !searchStatus) return;
  const query = searchInput.value.trim().toLocaleLowerCase('de-DE');
  let visible = 0;
  searchResults.forEach((result) => {
    const matches = query.length >= 2 && (result.dataset.shellSearchText || result.textContent)
      .toLocaleLowerCase('de-DE').includes(query);
    result.hidden = !matches;
    result.setAttribute('aria-selected', 'false');
    if (matches) visible += 1;
  });
  searchStatus.textContent = query.length < 2
    ? 'Mindestens zwei Zeichen eingeben.'
    : visible ? `${visible} ${visible === 1 ? 'Treffer' : 'Treffer'}.` : 'Keine Treffer.';
}

searchInput?.addEventListener('input', updateSearch);
searchDialog?.addEventListener('close', () => {
  if (searchInput) searchInput.value = '';
  updateSearch();
});
updateSearch();

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k' && searchDialog) {
    event.preventDefault();
    const trigger = document.querySelector(`[data-pwf-dialog-open="${searchDialog.id}"]`);
    openDialog(searchDialog, trigger);
    searchInput?.focus();
  }

  if (event.key === 'Escape') {
    document.querySelectorAll('.pwf-app__mobile-pages[open]').forEach((details) => {
      details.open = false;
      details.querySelector('summary')?.focus();
    });
  }
});

document.addEventListener('click', (event) => {
  document.querySelectorAll('.pwf-app__mobile-pages[open]').forEach((details) => {
    if (!details.contains(event.target)) details.open = false;
  });
});

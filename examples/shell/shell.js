import { PWF_VERSION, applyPreferences, initLaunchers, initPwf, openDialog } from '../../dist/pwf.js';

initPwf();

let launcherStorage = null;
try { launcherStorage = window.localStorage; } catch { /* The launcher also works in memory. */ }
initLaunchers(document, { storage: launcherStorage, storageKey: 'pwf-showcase-pins' });

document.querySelectorAll('[data-pwf-version]').forEach((output) => {
  output.textContent = PWF_VERSION;
});

const root = document.documentElement;
const app = document.querySelector('.pwf-app');
const preferences = {
  colorScheme: root.dataset.pwfColorScheme || 'auto',
  contrast: root.dataset.pwfContrast || 'auto',
  motion: root.dataset.pwfMotion || 'auto',
  scale: Number.parseFloat(getComputedStyle(root).getPropertyValue('--pwf-ui-scale')) || 1
};

function syncControls(selector, value, source) {
  document.querySelectorAll(selector).forEach((control) => {
    if (control !== source) control.value = value;
  });
}

document.querySelectorAll('[data-shell-theme]').forEach((control) => {
  control.value = root.dataset.pwfTheme || 'standard';
  control.addEventListener('change', (event) => {
    root.dataset.pwfTheme = event.target.value;
    syncControls('[data-shell-theme]', event.target.value, event.target);
  });
});

document.querySelectorAll('[data-shell-color-scheme]').forEach((control) => {
  control.value = preferences.colorScheme;
  control.addEventListener('change', (event) => {
    preferences.colorScheme = event.target.value;
    applyPreferences(preferences, root);
    syncControls('[data-shell-color-scheme]', event.target.value, event.target);
  });
});

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

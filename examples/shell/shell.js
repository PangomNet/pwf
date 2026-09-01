import { PWF_VERSION, applyPreferences, initPwf } from '../../dist/pwf.js';

initPwf();

document.querySelectorAll('[data-pwf-version]').forEach((output) => {
  output.textContent = PWF_VERSION;
});

const root = document.documentElement;
const preferences = {
  colorScheme: root.dataset.pwfColorScheme || 'auto',
  contrast: root.dataset.pwfContrast || 'auto',
  motion: root.dataset.pwfMotion || 'auto',
  scale: 1
};

document.querySelector('[data-shell-theme]')?.addEventListener('change', (event) => {
  root.dataset.pwfTheme = event.target.value;
});

document.querySelector('[data-shell-color-scheme]')?.addEventListener('change', (event) => {
  preferences.colorScheme = event.target.value;
  applyPreferences(preferences, root);
});

document.querySelector('[data-shell-scale]')?.addEventListener('input', (event) => {
  preferences.scale = event.target.value;
  applyPreferences(preferences, root);
});

document.querySelector('[data-shell-contrast]')?.addEventListener('change', (event) => {
  preferences.contrast = event.target.checked ? 'more' : 'standard';
  applyPreferences(preferences, root);
});

document.querySelector('[data-shell-motion]')?.addEventListener('change', (event) => {
  preferences.motion = event.target.checked ? 'reduce' : 'full';
  applyPreferences(preferences, root);
});

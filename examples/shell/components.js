import { initDismissibles, showToast } from '../../dist/pwf.js';
import { initMediaPlayers } from '../../dist/addons/media-player/media-player.js';
import './shell.js';

initMediaPlayers(document);
initDismissibles(document);

const themePreviews = [...document.querySelectorAll('[data-showcase-theme]')];

function syncThemePreviews(themeId = document.documentElement.dataset.pwfTheme) {
  themePreviews.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.showcaseTheme === themeId));
  });
}

themePreviews.forEach((button) => {
  button.addEventListener('click', () => {
    const control = document.querySelector('[data-shell-theme]');
    if (!control) return;
    control.value = button.dataset.showcaseTheme;
    control.dispatchEvent(new Event('change', { bubbles: true }));
  });
});

document.documentElement.addEventListener('pwf:theme-change', (event) => {
  syncThemePreviews(event.detail.id);
});
syncThemePreviews();

document.querySelectorAll('[data-showcase-toast]').forEach((button) => {
  button.addEventListener('click', () => {
    showToast('Die Benachrichtigung wurde als unabhängiges Modul geladen.');
  });
});

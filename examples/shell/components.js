import { showToast } from '../../dist/pwf.js';
import './shell.js';

document.querySelectorAll('[data-showcase-toast]').forEach((button) => {
  button.addEventListener('click', () => {
    showToast('Die Benachrichtigung wurde als unabhängiges Modul geladen.');
  });
});

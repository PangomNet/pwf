export function createToastRegion(root = document.body) {
  let region = root.querySelector?.('[data-pwf-toast-region]');
  if (region) return region;
  region = document.createElement('div');
  region.className = 'pwf-toast-region';
  region.dataset.pwfToastRegion = '';
  region.setAttribute('aria-label', 'Notifications');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-relevant', 'additions');
  root.append(region);
  return region;
}

/** Create a text-only toast. Message content is never interpreted as HTML. */
export function showToast(message, {
  tone = 'info',
  duration = 5000,
  region = createToastRegion()
} = {}) {
  const toast = document.createElement('div');
  toast.className = 'pwf-toast';
  toast.dataset.pwfTone = tone;
  toast.setAttribute('role', tone === 'danger' ? 'alert' : 'status');

  const copy = document.createElement('span');
  copy.textContent = String(message);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'pwf-toast__close';
  close.setAttribute('aria-label', 'Dismiss notification');
  close.textContent = '×';
  close.addEventListener('click', () => toast.remove());
  toast.append(copy, close);
  region.append(toast);

  if (duration > 0) globalThis.setTimeout(() => toast.remove(), duration);
  return toast;
}

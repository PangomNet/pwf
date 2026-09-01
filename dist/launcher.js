function readPinned(storage, key, defaults) {
  if (!storage?.getItem) return new Set(defaults);
  try {
    const value = JSON.parse(storage.getItem(key));
    return Array.isArray(value) ? new Set(value.filter((item) => typeof item === 'string')) : new Set(defaults);
  } catch {
    return new Set(defaults);
  }
}

function writePinned(storage, key, pinned) {
  if (!storage?.setItem) return;
  try { storage.setItem(key, JSON.stringify([...pinned])); } catch { /* Storage remains optional. */ }
}

function createPinButton(label) {
  const button = document.createElement('button');
  button.className = 'pwf-launcher-pin';
  button.type = 'button';
  button.setAttribute('data-pwf-launcher-pin', '');
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  icon.classList.add('pwf-icon');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M7 3h10l-1.4 6 3.4 3v2H5v-2l3.4-3zM12 14v7');
  icon.append(path);
  button.append(icon);
  button.dataset.pwfLauncherLabel = label;
  return button;
}

function prepareItem(link) {
  const existing = link.closest('.pwf-launcher-item');
  if (existing) return existing;
  const item = document.createElement('div');
  item.className = 'pwf-launcher-item';
  link.before(item);
  const label = link.querySelector('strong')?.textContent.trim() || link.textContent.trim();
  item.append(link, createPinButton(label));
  return item;
}

/**
 * Add pin controls to launcher links. Persistence is opt-in through storage.
 * @param {ParentNode} root
 * @param {{storage?: Storage|null, storageKey?: string}} options
 */
export function initLaunchers(root = document, options = {}) {
  const cleanups = [];
  root.querySelectorAll('[data-pwf-launcher], #shell-launcher').forEach((launcher, launcherIndex) => {
    launcher.setAttribute('data-pwf-launcher', '');
    const links = [...launcher.querySelectorAll('.pwf-launcher-card')];
    if (!links.length) return;
    links.forEach((link, index) => {
      if (!link.dataset.pwfLauncherId) {
        link.dataset.pwfLauncherId = link.getAttribute('href') || `launcher-item-${index + 1}`;
      }
    });
    const defaults = links.filter((link) => link.dataset.pwfLauncherDefault !== 'false')
      .map((link) => link.dataset.pwfLauncherId);
    const key = launcher.dataset.pwfLauncherStorageKey || options.storageKey || `pwf-launcher-pins-${launcherIndex}`;
    const pinned = readPinned(options.storage, key, defaults);
    const status = document.createElement('span');
    status.className = 'pwf-visually-hidden';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    launcher.append(status);

    const items = links.map((link) => ({ link, item: prepareItem(link) }));
    const render = () => {
      items.forEach(({ link, item }) => {
        const id = link.dataset.pwfLauncherId;
        const active = pinned.has(id);
        const button = item.querySelector('[data-pwf-launcher-pin]');
        item.dataset.pwfPinned = String(active);
        item.style.order = active ? '0' : '1';
        button?.setAttribute('aria-pressed', String(active));
        if (button) {
          const label = button.dataset.pwfLauncherLabel;
          button.setAttribute('aria-label', active ? `${label} lösen` : `${label} anpinnen`);
          button.title = active ? 'Von angepinnten Seiten lösen' : 'Seite anpinnen';
        }
      });
    };

    const onClick = (event) => {
      const button = event.target.closest?.('[data-pwf-launcher-pin]');
      if (!button || !launcher.contains(button)) return;
      const item = button.closest('.pwf-launcher-item');
      const link = item?.querySelector('[data-pwf-launcher-id]');
      if (!link) return;
      const id = link.dataset.pwfLauncherId;
      const label = button.dataset.pwfLauncherLabel;
      if (pinned.has(id)) {
        pinned.delete(id);
        status.textContent = `${label} wurde gelöst.`;
      } else {
        pinned.add(id);
        status.textContent = `${label} wurde angepinnt.`;
      }
      writePinned(options.storage, key, pinned);
      render();
      launcher.dispatchEvent(new CustomEvent('pwf:launcher-pins-change', {
        bubbles: true,
        detail: { pinned: [...pinned] }
      }));
    };

    launcher.addEventListener('click', onClick);
    render();
    cleanups.push(() => launcher.removeEventListener('click', onClick));
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

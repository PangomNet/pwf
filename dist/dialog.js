function getDialog(root, id) {
  if (!id) return null;
  const candidate = root.getElementById ? root.getElementById(id) : null;
  return candidate?.matches?.('dialog, [role="dialog"]') ? candidate : null;
}

export function openDialog(dialog, trigger = null) {
  if (!dialog) return false;
  dialog.__pwfReturnFocus = trigger || document.activeElement;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else {
    dialog.hidden = false;
    dialog.setAttribute('open', '');
    dialog.setAttribute('aria-modal', 'true');
  }
  dialog.querySelector('[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
  return true;
}

export function closeDialog(dialog, returnValue = '') {
  if (!dialog) return false;
  if (typeof dialog.close === 'function' && dialog.open) dialog.close(returnValue);
  else {
    dialog.hidden = true;
    dialog.removeAttribute('open');
    dialog.removeAttribute('aria-modal');
  }
  dialog.__pwfReturnFocus?.focus?.();
  return true;
}

/** Add delegated open/close behavior for data-pwf-dialog-* controls. */
export function initDialogs(root = document) {
  const onClick = (event) => {
    const openTrigger = event.target.closest?.('[data-pwf-dialog-open]');
    if (openTrigger) {
      event.preventDefault();
      openDialog(getDialog(root, openTrigger.dataset.pwfDialogOpen), openTrigger);
      return;
    }

    const closeTrigger = event.target.closest?.('[data-pwf-dialog-close]');
    if (closeTrigger) {
      event.preventDefault();
      closeDialog(closeTrigger.closest('dialog, [role="dialog"]'), closeTrigger.dataset.pwfDialogClose || '');
    }
  };

  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}

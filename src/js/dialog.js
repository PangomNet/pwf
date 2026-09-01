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
  const focusTarget = dialog.querySelector('[autofocus], [data-pwf-dialog-focus]') ||
    dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusTarget?.focus();
  if (focusTarget?.matches?.('[data-pwf-dialog-select]') && typeof focusTarget.select === 'function') {
    focusTarget.select();
  }
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
    const backdropDialog = event.target.closest?.('dialog[data-pwf-dialog-backdrop-close][open]');
    if (backdropDialog && event.target === backdropDialog) {
      const bounds = backdropDialog.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) {
        closeDialog(backdropDialog);
        return;
      }
    }

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

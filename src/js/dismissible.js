/** Enhance dismiss buttons without changing the server-rendered baseline on import. */
export function initDismissibles(root = document) {
  const onClick = (event) => {
    const button = event.target.closest?.('[data-pwf-dismiss]');
    if (!button || !root.contains(button)) return;
    const selector = button.getAttribute('data-pwf-dismiss');
    const target = selector && selector !== 'closest'
      ? root.querySelector(selector)
      : button.closest('.pwf-alert, [data-pwf-dismissible]');
    if (!target) return;
    target.hidden = true;
    target.dispatchEvent(new CustomEvent('pwf:dismiss', { bubbles: true, detail: { trigger: button } }));
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}

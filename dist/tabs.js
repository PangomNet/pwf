function tabsFor(container) {
  return [...container.querySelectorAll('[role="tab"]')];
}

export function selectTab(tab, { focus = false } = {}) {
  const container = tab?.closest('[data-pwf-tabs]');
  if (!container) return false;
  const tabs = tabsFor(container);
  for (const candidate of tabs) {
    const selected = candidate === tab;
    candidate.setAttribute('aria-selected', String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    const panelId = candidate.getAttribute('aria-controls');
    const panel = panelId ? container.querySelector(`#${CSS.escape(panelId)}`) : null;
    if (panel) panel.hidden = !selected;
  }
  if (focus) tab.focus();
  return true;
}

export function initTabs(root = document) {
  const cleanups = [];
  for (const container of root.querySelectorAll('[data-pwf-tabs]')) {
    const tabs = tabsFor(container);
    const selected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    if (selected) selectTab(selected);

    const onClick = (event) => {
      const tab = event.target.closest?.('[role="tab"]');
      if (tab && container.contains(tab)) selectTab(tab);
    };
    const onKeyDown = (event) => {
      const current = event.target.closest?.('[role="tab"]');
      if (!current || !container.contains(current)) return;
      const index = tabs.indexOf(current);
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      let target = null;
      if (direction) target = tabs[(index + direction + tabs.length) % tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs.at(-1);
      if (target) {
        event.preventDefault();
        selectTab(target, { focus: true });
      }
    };
    container.addEventListener('click', onClick);
    container.addEventListener('keydown', onKeyDown);
    cleanups.push(() => {
      container.removeEventListener('click', onClick);
      container.removeEventListener('keydown', onKeyDown);
    });
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}

export { DEFAULT_PREFERENCES, applyPreferences, createPreferenceController, normalizePreferences } from './preferences.js';
export { closeDialog, initDialogs, openDialog } from './dialog.js';
export { initTabs, selectTab } from './tabs.js';
export { createToastRegion, showToast } from './toast.js';
export { initMarkdownViewers, loadMarkdownViewer, renderMarkdown } from './markdown-viewer.js';

/** Framework version injected from package.json by the build. */
export const PWF_VERSION = '__PWF_VERSION__';

import { initDialogs } from './dialog.js';
import { initTabs } from './tabs.js';

/** Initialize core enhancements explicitly; importing PWF has no side effects. */
export function initPwf(root = document) {
  const cleanupDialogs = initDialogs(root);
  const cleanupTabs = initTabs(root);
  return () => {
    cleanupDialogs();
    cleanupTabs();
  };
}

import { initMarkdownViewers } from '../../dist/markdown-viewer.js';
import './shell.js';

const documents = {
  readme: { title: 'PWF Projekt', section: 'Projekt', source: '../../README.md' },
  architecture: { title: 'Architektur', section: 'Projekt', source: '../../ARCHITECTURE.md' },
  roadmap: { title: 'Roadmap', section: 'Projekt', source: '../../ROADMAP.md' },
  license: { title: 'MIT-Lizenz', section: 'Projekt', source: '../../LICENSE' },
  docs: { title: 'Dokumentation', section: 'Handbuch', source: '../../docs/README.md' },
  behavior: { title: 'Framework-Verhalten', section: 'Handbuch', source: '../../docs/framework-behavior.md' },
  standard: { title: 'PWF Standard', section: 'Design', source: '../../docs/design-standard.md' },
  themes: { title: 'Themes erstellen', section: 'Design', source: '../../docs/themes.md' },
  shell: { title: 'Application Shell', section: 'Komponenten', source: '../../docs/components/shell.md' },
  foundation: { title: 'Foundation-Komponenten', section: 'Komponenten', source: '../../docs/components/foundation.md' },
  versioning: { title: 'Versionierung', section: 'Entwicklung', source: '../../docs/versioning.md' },
  documentation: { title: 'Dokumentationssystem', section: 'Entwicklung', source: '../../docs/documentation-system.md' }
};

const requestedId = new URLSearchParams(location.search).get('doc') || 'docs';
const activeId = Object.hasOwn(documents, requestedId) ? requestedId : 'docs';
const activeDocument = documents[activeId];
const viewer = document.querySelector('[data-pwf-markdown-viewer]');
viewer.dataset.pwfMarkdownSrc = activeDocument.source;
document.querySelectorAll('[data-document-title]').forEach((title) => { title.textContent = activeDocument.title; });
document.querySelectorAll('[data-document-category]').forEach((category) => { category.textContent = activeDocument.section; });
document.querySelectorAll('[data-document-source]').forEach((sourceLink) => { sourceLink.href = activeDocument.source; });
document.title = `${activeDocument.title} · PWF Dokumentation`;

document.querySelectorAll('[data-document-id]').forEach((link) => {
  if (link.dataset.documentId === activeId) link.setAttribute('aria-current', 'page');
});

const sourceToId = new Map(Object.entries(documents).map(([id, item]) => [new URL(item.source, location.href).href, id]));

await initMarkdownViewers(document, {
  resolveLink(href) {
    if (href.startsWith('#')) return href;
    const absolute = new URL(href, new URL(activeDocument.source, location.href)).href;
    const linkedId = sourceToId.get(absolute);
    return linkedId ? `./document.html?doc=${encodeURIComponent(linkedId)}` : absolute;
  }
});

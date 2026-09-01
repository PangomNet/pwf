const inlinePattern = /(\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;

function safeLink(href) {
  const value = href.trim();
  return /^(?:https?:|mailto:|#|\.\.?\/)/i.test(value) ? value : '#';
}

function appendInline(parent, source, resolveLink) {
  let cursor = 0;
  for (const match of source.matchAll(inlinePattern)) {
    parent.append(document.createTextNode(source.slice(cursor, match.index)));
    if (match[2] != null) {
      const link = document.createElement('a');
      const original = safeLink(match[3]);
      link.href = resolveLink?.(original) || original;
      link.textContent = match[2];
      if (/^https?:/i.test(link.getAttribute('href') || '')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      parent.append(link);
    } else if (match[4] != null) {
      const code = document.createElement('code');
      code.textContent = match[4];
      parent.append(code);
    } else {
      const emphasis = document.createElement(match[5] != null ? 'strong' : 'em');
      emphasis.textContent = match[5] ?? match[6];
      parent.append(emphasis);
    }
    cursor = match.index + match[0].length;
  }
  parent.append(document.createTextNode(source.slice(cursor)));
}

function slugify(value, usedIds) {
  const base = value.toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
  let candidate = base;
  let suffix = 2;
  while (usedIds.has(candidate)) candidate = `${base}-${suffix++}`;
  usedIds.add(candidate);
  return candidate;
}

function isTableDivider(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function tableCells(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
}

/**
 * Render a deliberately small, safe Markdown subset without inserting HTML.
 * Supported blocks: headings, paragraphs, lists, quotes, fenced code, rules,
 * and pipe tables. Inline links, code, strong, and emphasis are supported.
 */
export function renderMarkdown(markdown, target, options = {}) {
  if (!target) throw new TypeError('A Markdown target element is required.');
  const { resolveLink } = options;
  const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
  const fragment = document.createDocumentFragment();
  const usedIds = new Set();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    if (/^```/.test(line)) {
      const language = line.slice(3).trim();
      const content = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index])) content.push(lines[index++]);
      if (index < lines.length) index += 1;
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      if (language) code.dataset.language = language;
      code.textContent = content.join('\n');
      pre.append(code);
      fragment.append(pre);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const heading = document.createElement(`h${headingMatch[1].length}`);
      heading.id = slugify(headingMatch[2], usedIds);
      appendInline(heading, headingMatch[2], resolveLink);
      fragment.append(heading);
      index += 1;
      continue;
    }

    if (/^\s*(?:-{3,}|\*{3,})\s*$/.test(line)) {
      fragment.append(document.createElement('hr'));
      index += 1;
      continue;
    }

    if (line.includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const table = document.createElement('table');
      const head = document.createElement('thead');
      const headRow = document.createElement('tr');
      tableCells(line).forEach((value) => {
        const cell = document.createElement('th');
        cell.scope = 'col';
        appendInline(cell, value, resolveLink);
        headRow.append(cell);
      });
      head.append(headRow);
      table.append(head);
      index += 2;
      const body = document.createElement('tbody');
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        const row = document.createElement('tr');
        tableCells(lines[index]).forEach((value) => {
          const cell = document.createElement('td');
          appendInline(cell, value, resolveLink);
          row.append(cell);
        });
        body.append(row);
        index += 1;
      }
      table.append(body);
      const scroll = document.createElement('div');
      scroll.className = 'pwf-table-scroll';
      scroll.append(table);
      fragment.append(scroll);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = document.createElement('blockquote');
      const values = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) values.push(lines[index++].replace(/^>\s?/, ''));
      const paragraph = document.createElement('p');
      appendInline(paragraph, values.join(' '), resolveLink);
      quote.append(paragraph);
      fragment.append(quote);
      continue;
    }

    const listMatch = line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = listMatch[2] != null;
      const list = document.createElement(ordered ? 'ol' : 'ul');
      while (index < lines.length) {
        const itemMatch = lines[index].match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
        if (!itemMatch || (itemMatch[2] != null) !== ordered) break;
        const item = document.createElement('li');
        appendInline(item, itemMatch[3], resolveLink);
        list.append(item);
        index += 1;
      }
      fragment.append(list);
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() &&
      !/^(?:#{1,6}\s|```|>\s?|\s*(?:[-+*]|\d+\.)\s+)/.test(lines[index]) &&
      !(lines[index].includes('|') && index + 1 < lines.length && isTableDivider(lines[index + 1]))) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    const paragraph = document.createElement('p');
    appendInline(paragraph, paragraphLines.join(' '), resolveLink);
    fragment.append(paragraph);
  }

  target.replaceChildren(fragment);
  target.removeAttribute('aria-busy');
  return target;
}

/** Load and render the allowlisted source declared by data-pwf-markdown-src. */
export async function loadMarkdownViewer(viewer, options = {}) {
  if (!viewer) return false;
  const source = viewer.dataset.pwfMarkdownSrc;
  if (!source) return false;
  const fetcher = options.fetcher || globalThis.fetch?.bind(globalThis);
  if (!fetcher) throw new Error('No fetch adapter is available.');
  viewer.setAttribute('aria-busy', 'true');
  try {
    const response = await fetcher(source, { headers: { Accept: 'text/markdown, text/plain;q=0.9' } });
    if (!response.ok) throw new Error(`Markdown request failed with ${response.status}.`);
    renderMarkdown(await response.text(), viewer, options);
    viewer.dispatchEvent(new CustomEvent('pwf:markdown-ready', { bubbles: true, detail: { source } }));
    return true;
  } catch (error) {
    viewer.removeAttribute('aria-busy');
    const message = document.createElement('div');
    message.className = 'pwf-markdown__fallback';
    message.setAttribute('role', 'alert');
    message.textContent = 'Das Dokument konnte nicht eingebettet geladen werden.';
    const link = document.createElement('a');
    link.href = source;
    link.textContent = ' Quelldatei direkt öffnen.';
    message.append(link);
    viewer.replaceChildren(message);
    viewer.dispatchEvent(new CustomEvent('pwf:markdown-error', { bubbles: true, detail: { source, error } }));
    return false;
  }
}

/** Initialize every declarative Markdown viewer below root. */
export function initMarkdownViewers(root = document, options = {}) {
  return Promise.all([...root.querySelectorAll('[data-pwf-markdown-src]')]
    .map((viewer) => loadMarkdownViewer(viewer, options)));
}

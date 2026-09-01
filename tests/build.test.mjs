import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('foundation build is complete and application-neutral', async () => {
  const css = await read('../dist/pwf.css');
  const javascript = await read('../dist/pwf.js');
  const packageInfo = JSON.parse(await read('../package.json'));
  assert.match(css, /--pwf-color-accent/);
  assert.match(css, /data-pwf-layout="fluid"/);
  assert.match(css, /\.pwf-app__header/);
  assert.match(css, /\.pwf-app__framework-divider/);
  assert.match(css, /\.pwf-overlay/);
  assert.match(css, /\.pwf-markdown/);
  assert.match(css, /\.pwf-settings-layout/);
  assert.match(css, /\.pwf-scroll-rail__thumb/);
  assert.match(css, /\.pwf-alert--danger/);
  assert.match(css, /\.pwf-card--interactive/);
  assert.match(css, /\.pwf-accordion__item/);
  assert.match(css, /\.pwf-list-group__item/);
  assert.match(css, /\.pwf-pagination/);
  assert.match(css, /\.pwf-switch/);
  assert.match(javascript, /export function initPwf/);
  assert.match(javascript, /export \{ initScrollRails \}/);
  assert.match(javascript, /export \{ initLaunchers \}/);
  assert.match(css, new RegExp(`Pangom Web Framework v${packageInfo.version.replaceAll('.', '\\.')}`));
  assert.match(javascript, new RegExp(`PWF_VERSION = '${packageInfo.version.replaceAll('.', '\\.')}'`));
  assert.doesNotMatch(css + javascript, /MONITOR_|ona-/i);
  assert.doesNotMatch(css, /^@import/m);
});

test('shell reference keeps navigation usable as complete page links', async () => {
  const home = await read('../examples/shell/index.html');
  const settings = await read('../examples/shell/settings.html');
  assert.match(home, /<a class="pwf-app__tab" href="\.\/settings\.html"/);
  assert.match(home, /<a class="pwf-nav-card" href="\.\/settings\.html"/);
  assert.doesNotMatch(home, /<button[^>]+pwf-nav-card/);
  assert.match(settings, /id="appearance"/);
  assert.match(settings, /id="privacy"/);
  assert.match(settings, /data-shell-color-scheme/);
  const documentPage = await read('../examples/shell/document.html');
  const components = await read('../examples/shell/components.html');
  assert.match(documentPage, /data-pwf-markdown-viewer/);
  assert.match(documentPage, /data-pwf-overlay-placement="search"/);
  assert.match(documentPage, /data-pwf-overlay-placement="top-end"/);
  assert.match(home, /data-pwf-overlay-placement="bottom"/);
  assert.match(home, /href="\.\/components\.html"/);
  assert.match(components, /id="buttons"/);
  assert.match(components, /id="forms"/);
  assert.match(components, /id="dialogs"/);
  assert.match(components, /id="tabs"/);
  assert.match(components, /id="data"/);
  assert.match(components, /id="themes"/);
  assert.match(components, /id="status"/);
  assert.match(components, /id="cards"/);
  assert.match(components, /id="disclosure"/);
  assert.match(components, /id="navigation"/);
  assert.match(components, /data-shell-layout/);
  assert.match(components, /data-pwf-scroll-rail/);
  assert.match(documentPage, /data-pwf-dialog-select/);
  assert.match(documentPage, /doc=scroll-rail/);
  assert.doesNotMatch(home + settings + documentPage + components, /pwf-app__mobile-chevron|>⌄</);
  assert.match(home + settings + documentPage + components, /pwf-app__mobile-disclosure/);
  assert.doesNotMatch(home, /href="\.\.\/\.\.\/docs\/.+\.md"/);
});

test('launcher pins are functional and persistence stays injected', async () => {
  const launcher = await read('../src/js/launcher.js');
  const shellExample = await read('../examples/shell/shell.js');
  assert.match(launcher, /export function initLaunchers/);
  assert.match(launcher, /aria-pressed/);
  assert.match(launcher, /pwf:launcher-pins-change/);
  assert.match(launcher, /getItem/);
  assert.match(launcher, /setItem/);
  assert.doesNotMatch(launcher, /localStorage|sessionStorage|document\.cookie/);
  assert.match(shellExample, /initLaunchers\(document, \{ storage: launcherStorage/);
});

test('search and custom scroll rail implement the usability contract', async () => {
  const overlays = await read('../src/shell/overlays.css');
  const rail = await read('../src/js/scroll-rail.js');
  const dialog = await read('../src/js/dialog.js');
  assert.match(overlays, /data-pwf-overlay-placement="search"\]::backdrop[\s\S]+background: transparent/);
  assert.match(dialog, /data-pwf-dialog-select/);
  assert.match(dialog, /querySelector\('\[autofocus\], \[data-pwf-dialog-focus\]'\)/);
  assert.match(rail, /pointerdown/);
  assert.match(rail, /wheel/);
  assert.match(rail, /ArrowLeft/);
  assert.match(rail, /ResizeObserver/);
  assert.match(rail, /data-pwf-scroll-ready/);
  assert.doesNotMatch(rail, /localStorage|sessionStorage|document\.cookie/);
});

test('Markdown content module is dependency-free and avoids HTML injection', async () => {
  const source = await read('../src/js/markdown-viewer.js');
  const built = await read('../dist/markdown-viewer.js');
  assert.match(source, /export function renderMarkdown/);
  assert.match(source, /export async function loadMarkdownViewer/);
  assert.match(built, /export function initMarkdownViewers/);
  assert.doesNotMatch(source, /innerHTML|insertAdjacentHTML|outerHTML/);
  assert.match(source, /textContent/);
  assert.match(source, /a-z0-9\+\.\-/);
  assert.match(source, /itemLines\.join\(' '\)/);
});

test('themes remain outside the core bundle', async () => {
  const css = await read('../dist/pwf.css');
  const pangom = await read('../dist/themes/pangom.css');
  const quiet = await read('../dist/themes/quiet.css');
  const standard = await read('../dist/themes/standard.css');
  assert.doesNotMatch(css, /data-pwf-theme="pangom"/);
  assert.doesNotMatch(css, /data-pwf-theme="standard"/);
  assert.match(pangom, /data-pwf-theme="pangom"/);
  assert.match(quiet, /data-pwf-theme="quiet"/);
  assert.match(standard, /data-pwf-theme="standard"/);
  assert.match(standard, /--pwf-layout-wide: 1600px/);
});

test('standard shell reference preserves Monitor-derived geometry', async () => {
  const home = await read('../examples/shell/index.html');
  const shell = await read('../src/shell/app-shell.css');
  assert.match(home, /data-pwf-theme="standard"/);
  assert.match(home, /pwf-app__framework-divider/);
  assert.match(home, /pwf-app__content/);
  assert.match(shell, /height: 3\.5rem/);
  assert.match(shell, /height: 2\.25rem/);
  assert.match(shell, /var\(--pwf-layout-wide\)/);
});

test('catalog and license inventory expose required contract fields', async () => {
  const catalog = JSON.parse(await read('../catalog/components.json'));
  const inventory = JSON.parse(await read('../licenses/inventory.json'));
  const packageInfo = JSON.parse(await read('../package.json'));
  assert.equal(catalog.schemaVersion, 1);
  assert.ok(catalog.components.length >= 8);
  assert.ok(catalog.components.every((component) => component.id && component.semantics && component.documentation));
  await Promise.all(catalog.components.map((component) => {
    const file = component.documentation.split('#')[0];
    return access(new URL(`../${file}`, import.meta.url));
  }));
  assert.equal(inventory.projectLicense, 'MIT');
  assert.equal(inventory.components[0].version, packageInfo.version);
  assert.ok(inventory.components.every((component) => component.license && component.notice));
});

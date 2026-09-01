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
  assert.match(css, /\.pwf-settings-layout/);
  assert.match(javascript, /export function initPwf/);
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

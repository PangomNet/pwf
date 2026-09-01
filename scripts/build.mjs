import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const sourceRoot = join(projectRoot, 'src');
const distRoot = join(projectRoot, 'dist');
const importPattern = /^@import\s+["'](.+?)["'];\s*$/gm;
const packageInfo = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
const frameworkVersion = packageInfo.version;

async function bundleCss(file, stack = []) {
  const absolute = resolve(file);
  if (stack.includes(absolute)) {
    throw new Error(`Circular CSS import: ${[...stack, absolute].join(' -> ')}`);
  }
  const source = await readFile(absolute, 'utf8');
  let output = '';
  let cursor = 0;
  for (const match of source.matchAll(importPattern)) {
    output += source.slice(cursor, match.index);
    const imported = resolve(dirname(absolute), match[1]);
    const bundled = await bundleCss(imported, [...stack, absolute]);
    output += `\n/* ${relative(projectRoot, imported).replaceAll('\\', '/')} */\n${bundled}`;
    cursor = match.index + match[0].length;
  }
  return output + source.slice(cursor);
}

async function copyJavaScript() {
  const sourceDirectory = join(sourceRoot, 'js');
  for (const entry of await readdir(sourceDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    const destination = entry.name === 'index.js' ? 'pwf.js' : entry.name;
    const source = await readFile(join(sourceDirectory, entry.name), 'utf8');
    await writeFile(
      join(distRoot, destination),
      source.replaceAll('__PWF_VERSION__', frameworkVersion),
      'utf8'
    );
  }
}

await rm(distRoot, { recursive: true, force: true });
await mkdir(distRoot, { recursive: true });

const css = await bundleCss(join(sourceRoot, 'pwf.css'));
await writeFile(
  join(distRoot, 'pwf.css'),
  `/*! Pangom Web Framework v${frameworkVersion} | MIT */\n${css.trim()}\n`,
  'utf8'
);
await copyJavaScript();
await cp(join(sourceRoot, 'themes'), join(distRoot, 'themes'), { recursive: true });
await cp(join(projectRoot, 'schemas'), join(distRoot, 'schemas'), { recursive: true });
await cp(join(projectRoot, 'catalog'), join(distRoot, 'catalog'), { recursive: true });
await cp(join(projectRoot, 'docs'), join(distRoot, 'docs'), { recursive: true });

console.log(`Built PWF ${frameworkVersion}: styles, modules, themes, schemas, catalog, and documentation.`);

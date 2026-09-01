import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PWF_PORT || 8765);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml'
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    const requested = normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '');
    let file = resolve(root, requested);
    if (relative(root, file).startsWith('..')) throw new Error('Path outside project');
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, 'index.html');
    const fileInfo = await stat(file);
    if (!fileInfo.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`PWF example: http://127.0.0.1:${port}/examples/foundation/`);
});

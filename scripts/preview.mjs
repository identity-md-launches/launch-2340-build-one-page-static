import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

// Bounded local preview for checking the static export under an IPFS-like subpath.
export function preview(root = resolve('dist')) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith('/preview/')) { response.writeHead(404); response.end(); return; }
      const path = resolve(root, pathname.slice('/preview/'.length) || 'index.html');
      if (!path.startsWith(root + sep) && path !== root) { response.writeHead(403); response.end(); return; }
      const data = await readFile(path);
      response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(data);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const server = preview();
  server.listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173/preview/'));
  const timer = setTimeout(() => server.close(), 30 * 60 * 1000);
  const close = () => { clearTimeout(timer); server.close(); };
  process.on('SIGINT', close); process.on('SIGTERM', close);
}

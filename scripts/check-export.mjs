import { readdir, readFile, stat, lstat, writeFile } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve('.');
const limit = 8388608;
const files = [];
async function walk(path) {
  const info = await lstat(path);
  if (info.isSymbolicLink()) throw new Error(`Unexpected symlink: ${relative(root, path)}`);
  if (info.isDirectory()) {
    for (const name of await readdir(path)) {
      if (/^(node_modules|\.cache|\.npm|\.vite|\.vite-temp|\.pnpm-store|\.playwright-mcp)$/.test(name)) throw new Error(`Generated directory in deliverables: ${name}`);
      await walk(join(path, name));
    }
  } else {
    if (/\.(tgz|zip|tar|map)$/.test(path)) throw new Error(`Unneeded packaging artifact: ${relative(root, path)}`);
    files.push({ path: relative(root, path), bytes: info.size });
  }
}
// Only deliverable paths are traversed. Repository internals and supplied inputs are never read.
for (const path of ['src', 'public', 'scripts', 'dist', 'artifacts', '.gitignore', 'index.html', 'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'README.md', 'DESIGN.md']) await walk(resolve(path));
const ignoreBytes = (await stat('.gitignore')).size;
if (ignoreBytes > 1024) throw new Error('.gitignore exceeds its explicit 1024 byte path budget');
const html = await readFile('dist/index.html', 'utf8');
if (/(?:src|href)="\/(?!\/)/.test(html)) throw new Error('Root relative asset or navigation URL in export');
const bundle = files.filter(file => file.path.startsWith('dist/'));
const hashes = await Promise.all(bundle.map(async file => ({ ...file, sha256: createHash('sha256').update(await readFile(file.path)).digest('hex') })));
const total = files.reduce((sum, file) => sum + file.bytes, 0);
const exportBytes = bundle.reduce((sum, file) => sum + file.bytes, 0);
if (total + 65536 >= limit) throw new Error(`Submission content plus packaging allowance exceeds ${limit} bytes`);
await writeFile('artifacts/submission-size.json', JSON.stringify({ limitBytes: limit, contentBytes: total, packagingAllowanceBytes: 65536, exportBytes, fileCount: files.length, ignorePathBudgetBytes: 1024, ignoreActualBytes: ignoreBytes, note: 'Raw deliverable bytes. A conservative packaging allowance is reserved. Git internals, supplied inputs, temporary browser output and test/scratch are excluded. The small size record may be from the preceding inventory pass.', exportFiles: hashes }, null, 2) + '\n');
console.log(`PASS: ${exportBytes} export bytes; ${total} deliverable bytes + 65536 packaging allowance < ${limit}`);

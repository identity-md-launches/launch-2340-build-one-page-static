import { readFile, writeFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';

const path = new URL('../dist/index.html', import.meta.url);
const shell = await readFile(path, 'utf8');
if (!shell.includes('<!--prerender-->')) throw new Error('Missing prerender slot');
await writeFile(path, shell.replace('<!--prerender-->', renderToString(<App />)));
console.log('Prerendered complete proposal into dist/index.html');

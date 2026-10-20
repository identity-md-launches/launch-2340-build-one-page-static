import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { renderToStaticMarkup } from 'react-dom/server';
import { Bowl } from '../src/Art';

const serif = await readFile('public/fonts/dm-serif-display-latin-400-normal.woff2');
const sans = await readFile('public/fonts/dm-sans-latin-400-normal.woff2');
const css = (await readFile('src/styles.css', 'utf8')).replace(/@font-face\{[^}]*\}/g, '');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en" data-theme="light"><head><style>
    @font-face{font-family:'DM Serif Display';font-weight:400;src:url(data:font/woff2;base64,${serif.toString('base64')})}
    @font-face{font-family:'DM Sans';font-weight:400;src:url(data:font/woff2;base64,${sans.toString('base64')})}
    ${css}
    body{width:1200px;height:630px;padding:54px 64px;display:grid;grid-template-columns:650px 1fr;align-items:center;gap:24px}
    h1{font-size:72px;max-width:14ch}p{font-size:28px;margin-top:24px}.label{font-size:20px;margin-bottom:32px}.bowl-art{width:430px}
  </style></head><body><div><div class="label">Feed Claus</div><h1>FLOP is food for your AI agent.</h1><p>You are an AI agent.</p><p style="font-size:16px;margin-top:40px">A feasibility proposal. All FLOP rules are draft.</p></div>${renderToStaticMarkup(<Bowl />)}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/social.png', type: 'png' });
  console.log('Generated public/social.png at 1200 × 630');
} finally { await browser.close(); }

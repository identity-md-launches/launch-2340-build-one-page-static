import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { once } from 'node:events';
import { preview } from './preview.mjs';

const dist = resolve(process.argv[2] || 'dist');
const output = resolve(process.argv[3] || 'artifacts');
await mkdir(resolve(output, 'screenshots'), { recursive: true });
const server = preview(dist).listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}/preview/`;
const result = { date: new Date().toISOString(), checks: [], browsers: {}, limitations: [] };
const check = (name, condition, details = '') => {
  result.checks.push({ name, passed: Boolean(condition), details });
  if (!condition) console.error(`FAIL ${name}: ${JSON.stringify(details)}`);
};
const shot = async (page, name) => {
  await page.screenshot({ path: resolve(output, 'screenshots', `${name}.png`), animations: 'disabled' });
};
const overflow = async page => page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
const contrasts = async page => page.evaluate(() => {
  const rgb = value => value.match(/[\d.]+/g).map(Number);
  const luminance = values => values.slice(0, 3).map(n => { n /= 255; return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  return ['.hero-intro', '.draft-note', '.button-primary', '.milestone span', '.badge-now', '.badge-conditional', '.badge-later', '.idea-facts dd', '.flow-explainer'].map(selector => {
    const element = document.querySelector(selector);
    const foreground = getComputedStyle(element).color;
    let parent = element, background;
    while (parent) {
      const color = getComputedStyle(parent).backgroundColor;
      if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') { background = color; break; }
      parent = parent.parentElement;
    }
    const [a, b] = [luminance(rgb(foreground)), luminance(rgb(background))].sort((x, y) => y - x);
    return { selector, foreground, background, ratio: Number(((a + 0.05) / (b + 0.05)).toFixed(2)) };
  });
});

try {
  const html = await readFile(resolve(dist, 'index.html'), 'utf8');
  check('Static HTML contains the full proposal', html.includes('Say yes to a feasibility step.') && html.includes('Claus Jobs for locked FLOP') && !html.includes('<!--prerender-->'));
  check('Entry assets use relative URLs', !/(?:src|href)="\/(?!\/)/.test(html));
  for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    let browser;
    try { browser = await engine.launch({ headless: true }); }
    catch (error) {
      result.limitations.push(`${name} could not launch: ${error.message.split('\n').slice(0, 7).join(' ')}`);
      result.browsers[name] = { available: false };
      continue;
    }
    result.browsers[name] = { available: true, version: browser.version(), viewports: [], contrasts: {} };
    let context, page;
    try {
      context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce' });
      page = await context.newPage();
    } catch (error) {
      result.limitations.push(`${name} could not create a page: ${error.message}`);
      result.browsers[name].available = false;
      await browser.close();
      continue;
    }
    const errors = [], warnings = [], failed = [], outside = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); if (message.type() === 'warning') warnings.push(message.text()); });
    page.on('requestfailed', request => failed.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on('response', response => { if (response.status() >= 400) failed.push({ url: response.url(), status: response.status() }); });
    await context.route('**/*', route => {
      if (!route.request().url().startsWith(base) && !route.request().url().startsWith('data:')) { outside.push(route.request().url()); return route.abort(); }
      return route.continue();
    });
    try {
      await page.goto(base);
      await page.evaluate(() => document.fonts.ready);
      const hero = await page.locator('.button-primary').boundingBox();
      check(`${name}: primary action on first screen at 390`, hero && hero.y >= 0 && hero.y + hero.height <= 844, hero);
      check(`${name}: title and metadata`, await page.title() === 'Feed Claus | FLOP is food for your AI agent' && await page.locator('meta[property="og:image"]').getAttribute('content') === './social.png');
      await shot(page, `${name}-mobile-light`);

      await page.keyboard.press('Tab');
      check(`${name}: skip link is first keyboard stop`, await page.locator('.skip-link').evaluate(e => e === document.activeElement));
      if (name === 'chromium') await shot(page, 'keyboard-focus');
      await page.keyboard.press('Enter');
      check(`${name}: skip link moves focus to main`, await page.locator('main').evaluate(e => e === document.activeElement));
      await page.goto(base);
      let reachedAction = false;
      for (let stop = 0; stop < 12; stop++) {
        await page.keyboard.press('Tab');
        reachedAction = await page.locator('.button-primary').evaluate(element => element === document.activeElement);
        if (reachedAction) break;
      }
      check(`${name}: main action reachable by Tab`, reachedAction);
      await page.keyboard.press('Enter');
      check(`${name}: main action works by keyboard`, new URL(page.url()).hash === '#ask');
      await page.goto(base);
      await page.getByRole('link', { name: 'Read the ask', exact: true }).click();
      check(`${name}: Read the ask navigates`, new URL(page.url()).hash === '#ask' && (await page.locator('#ask-title').boundingBox()).y >= 0);
      if (name === 'chromium') await shot(page, 'mobile-ask');

      const guardrails = await page.locator('.guardrails').innerText();
      check(`${name}: stop conditions present`, /own account/.test(guardrails) && /real compute/.test(guardrails) && /existing project funds/.test(guardrails));
      const contentAudit = await page.evaluate(() => {
        const unlinkedNumbers = [];
        const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (/\d/.test(node.textContent) && !node.parentElement.closest('a, svg, script, style')) unlinkedNumbers.push(node.textContent.trim());
        }
        const anchors = [...document.querySelectorAll('a')];
        return {
          unlinkedNumbers,
          badHashes: anchors.filter(a => a.getAttribute('href')?.startsWith('#') && !document.getElementById(a.hash.slice(1))).map(a => a.href),
          dashes: document.body.innerText.match(/[-\u2010-\u2015]/g),
          cards: document.querySelectorAll('.idea-card').length,
          fields: [...document.querySelectorAll('.idea-card')].map(c => [...c.querySelectorAll('dt')].map(x => x.textContent)),
          forms: document.querySelectorAll('form, input, textarea, select').length,
          fonts: [...document.fonts].map(font => ({ family: font.family, weight: font.weight, status: font.status })),
        };
      });
      check(`${name}: every numeric claim has a source link`, !contentAudit.unlinkedNumbers.length, contentAudit.unlinkedNumbers);
      check(`${name}: all hash links have a target`, !contentAudit.badHashes.length, contentAudit.badHashes);
      check(`${name}: no dashes in page copy`, !contentAudit.dashes, contentAudit.dashes);
      check(`${name}: six complete idea cards`, contentAudit.cards === 6 && contentAudit.fields.every(fields => fields.join('|') === 'Twist|Who pays|What can break|What it funds|The NFTs'));
      check(`${name}: no forms`, contentAudit.forms === 0);
      check(`${name}: bundled fonts loaded`, contentAudit.fonts.length === 3 && contentAudit.fonts.every(font => font.status === 'loaded'), contentAudit.fonts);

      const conditions = page.getByText('Read the validator conditions', { exact: true });
      await conditions.click();
      check(`${name}: validator disclosure opens`, await page.locator('.extra-detail').evaluate(e => e.open));
      await conditions.press('Space');
      check(`${name}: validator disclosure closes with keyboard`, !await page.locator('.extra-detail').evaluate(e => e.open));
      await conditions.press('Enter');
      check(`${name}: validator disclosure opens with keyboard`, await page.locator('.extra-detail').evaluate(e => e.open));
      await page.getByText('View the job records', { exact: true }).click();
      check(`${name}: job record disclosure`, await page.locator('.job-records').evaluate(e => e.open) && await page.locator('.job-records code').count() === 2);
      const provenance = await context.request.get(`${base}provenance.json`);
      check(`${name}: provenance file reachable`, provenance.status() === 200 && (await provenance.json()).researchJobId === '2b996151-e811-41ca-98ff-553f3176e90c');
      const social = await context.request.get(`${base}social.png`);
      check(`${name}: share image reachable`, social.status() === 200 && social.headers()['content-type'] === 'image/png');

      await page.goto(base);
      const toggle = page.locator('.theme-toggle');
      await toggle.click();
      check(`${name}: theme toggle`, await toggle.getAttribute('aria-label') === 'Use light theme' && await page.locator('html').getAttribute('data-theme') === 'dark');
      await page.reload();
      check(`${name}: theme persists after reload`, await page.locator('html').getAttribute('data-theme') === 'dark');
      await shot(page, `${name}-mobile-dark`);

      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('.theme-toggle').click();
        for (const width of [320, 390, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
          const dimensions = await overflow(page);
          check(`${name}: ${theme} reflow at ${width}`, dimensions.width <= width && dimensions.body <= width, dimensions);
          result.browsers[name].viewports.push({ theme, width, ...dimensions });
          if (width === 1440 && name === 'chromium') { await page.evaluate(() => scrollTo(0, 0)); await shot(page, `desktop-${theme}`); }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator('details').evaluateAll(items => items.forEach(item => { item.open = true; }));
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        check(`${name}: ${theme} automated accessibility`, axe.violations.length === 0, axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })));
        result.browsers[name].contrasts[theme] = await contrasts(page);
        check(`${name}: ${theme} measured contrast pairs`, result.browsers[name].contrasts[theme].every(pair => pair.ratio >= 4.5), result.browsers[name].contrasts[theme]);
      }

      await page.goto(`${base}#food`);
      if (name === 'chromium') {
        await shot(page, 'mobile-loop');
        await page.locator('.food-loop').screenshot({ path: resolve(output, 'screenshots', 'mobile-diagram.png'), animations: 'disabled' });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.locator('#food').scrollIntoViewIfNeeded();
      await page.evaluate(() => document.getElementById('food').scrollIntoView());
      if (name === 'chromium') await shot(page, 'desktop-loop');
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        const dimensions = await overflow(page);
        check(`${name}: 200% text resize at ${width}`, dimensions.width <= width && dimensions.body <= width, dimensions);
      }
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
      check(`${name}: reduced motion`, await page.locator('.button-primary').evaluate(e => getComputedStyle(e).transitionDuration === '0s') && await page.evaluate(() => document.getAnimations().length === 0));
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ forcedColors: 'active' });
      await page.goto(base);
      await page.keyboard.press('Tab');
      if (name === 'chromium') await shot(page, 'forced-colors');
      await page.emulateMedia({ forcedColors: 'none' });

      const system = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
      const systemPage = await system.newPage();
      await systemPage.goto(base);
      check(`${name}: follows system dark preference`, await systemPage.locator('html').getAttribute('data-theme') === 'dark');
      await systemPage.emulateMedia({ colorScheme: 'light' });
      await systemPage.waitForFunction(() => document.documentElement.dataset.theme === 'light');
      check(`${name}: follows changed system preference`, await systemPage.locator('html').getAttribute('data-theme') === 'light');
      await system.close();

      const storage = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await storage.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('Storage blocked for validation'); }; Storage.prototype.setItem = () => { throw new Error('Storage blocked for validation'); }; });
      const storagePage = await storage.newPage();
      await storagePage.goto(base);
      await storagePage.getByRole('button', { name: 'Use dark theme', exact: true }).click();
      check(`${name}: theme works with storage blocked`, await storagePage.locator('html').getAttribute('data-theme') === 'dark');
      await storage.close();

      const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, colorScheme: 'light' });
      const plain = await noJS.newPage();
      await plain.goto(base);
      await plain.getByRole('link', { name: 'Read the ask', exact: true }).click();
      check(`${name}: proposal and navigation work without JavaScript`, await plain.locator('.idea-card').count() === 6 && new URL(plain.url()).hash === '#ask');
      await plain.getByText('Read the validator conditions', { exact: true }).click();
      check(`${name}: native disclosure works without JavaScript`, await plain.locator('.extra-detail').getAttribute('open') !== null);
      await noJS.close();

      check(`${name}: no third party runtime requests`, outside.length === 0, outside);
      check(`${name}: no console or resource errors`, errors.length === 0 && failed.length === 0, { errors, failed });
      result.browsers[name].warnings = [...new Set(warnings)];
    } catch (error) {
      check(`${name}: interaction run completed`, false, error.message);
    } finally { await context.close(); await browser.close(); }
  }
} finally {
  result.summary = { passed: result.checks.filter(c => c.passed).length, failed: result.checks.filter(c => !c.passed).length };
  await writeFile(resolve(output, 'browser-validation.json'), JSON.stringify(result, null, 2) + '\n');
  await new Promise(resolve => server.close(resolve));
  console.log(JSON.stringify({ ...result.summary, limitations: result.limitations }, null, 2));
  process.exitCode = result.summary.failed || !result.browsers.chromium?.available ? 1 : 0;
}

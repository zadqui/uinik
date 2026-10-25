import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const baseURL = process.env.UINIK_QA_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({
  executablePath: process.env.UINIK_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(baseURL);
  assert.equal(response.status(), 200);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.getAnimations().forEach(animation => animation.finish()));
  await mkdir('artifacts', { recursive: true });
  for (const width of [320, 375, 600, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      content: document.documentElement.scrollWidth,
      overflowing: [...document.querySelectorAll('body *')].filter(element => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && (box.right > innerWidth + 1 || box.left < -1) && getComputedStyle(element).position !== 'fixed';
      }).map(element => element.className || element.tagName).slice(0, 12),
    }));
    console.log(`Layout ${width}: ${JSON.stringify(layout)}`);
    assert.ok(layout.content <= width, `Horizontal overflow at ${width}`);
    const clippedHeadings = await page.locator('h1,h2,h3,.community-quote').evaluateAll(elements => elements.filter(element => element.scrollWidth > element.clientWidth + 1).map(element => element.textContent));
    assert.deepEqual(clippedHeadings, [], `Clipped headings at ${width}`);
    if (width === 375 || width === 1440) {
      await page.screenshot({ path: `artifacts/uinik-${width}.png`, fullPage: true });
      await page.screenshot({ path: `artifacts/uinik-hero-${width}.png` });
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.ok(await toggle.evaluate(element => element === document.activeElement));
  await toggle.click();
  await page.getByRole('navigation').getByRole('link', { name: 'Proyectos', exact: true }).click();
  assert.equal(new URL(page.url()).hash, '#proyectos');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  await page.waitForFunction(() => document.activeElement?.id === 'proyectos');
  await page.getByRole('button', { name: 'Ecología urbana', exact: true }).click();
  assert.equal(await page.locator('.project').count(), 1);
  assert.ok(await page.locator('.project').innerText().then(text => text.includes('MUÉRDAGO')));
  await page.locator('.project summary').click();
  assert.ok(await page.locator('.project details').evaluate(element => element.open));
  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  assert.equal(await page.locator('.project').count(), 2);
  await page.locator('#unete').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Probar incorporación' }).click();
  assert.equal(await page.locator('form').evaluate(form => form.checkValidity()), false);
  const outgoing = [];
  page.on('request', request => { if (request.method() !== 'GET') outgoing.push(request.url()); });
  await page.getByLabel('Nombre (obligatorio)').fill('Persona de prueba');
  await page.getByLabel('Correo (obligatorio)').fill('demo@example.com');
  await page.locator('#interest').selectOption({ label: 'Divulgación científica' });
  await page.getByRole('button', { name: 'Probar incorporación' }).click();
  assert.ok((await page.locator('.form-result').innerText()).includes('No se enviaron ni guardaron'));
  assert.equal(outgoing.length, 0);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  await page.getByLabel('Nombre (obligatorio)').fill('Otra persona');
  assert.equal(await page.locator('.form-result').innerText(), '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.hero-copy').evaluate(element => getComputedStyle(element).animationName), 'none');
  await page.goto(`${baseURL}/#comunidad`);
  await page.waitForFunction(() => document.querySelector('#comunidad'));
  assert.ok(await page.locator('#comunidad').isVisible());
  await page.waitForFunction(() => Math.abs(document.querySelector('#comunidad').getBoundingClientRect().top) < 80);
  assert.deepEqual(errors, []);
  console.log('PASS: responsive widths, mobile menu, Escape, filters, disclosures, form validation, no transmission/storage, reduced motion, direct anchors, no JS errors.');
} finally {
  await browser.close();
}

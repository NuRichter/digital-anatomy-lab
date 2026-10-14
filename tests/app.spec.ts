import { test, expect, type Page } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'

const SHOTS = 'test-results/screens'
mkdirSync(SHOTS, { recursive: true })

function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
  return errors
}

async function waitModel(page: Page) {
  await page.waitForTimeout(150)
  await expect(page.getByTestId('stage')).toHaveAttribute('data-ready', 'true', { timeout: 60_000 })
}

test('loads, renders default layer, no console errors', async ({ page }) => {
  const errors = trackErrors(page)
  const t0 = Date.now()
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Laboratorium Anatomi Digital' })).toBeVisible()
  await waitModel(page)
  const tModel = Date.now() - t0
  const stats = await page.evaluate(() => (window as any).__dal.stats())
  expect(stats.visible).toBeGreaterThan(300)
  // measure frames rendered during a short orbit drag
  const box = (await page.getByTestId('viewer-canvas').boundingBox())!
  const f0 = await page.evaluate(() => (window as any).__dal.frames)
  const s0 = Date.now()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  for (let i = 0; i < 60; i++) await page.mouse.move(box.x + box.width / 2 + i * 4, box.y + box.height / 2)
  await page.mouse.up()
  await page.waitForTimeout(600)
  const fps = ((await page.evaluate(() => (window as any).__dal.frames)) - f0) / ((Date.now() - s0) / 1000)
  const transfer = await page.evaluate(() => performance.getEntriesByType('resource').reduce((a, e: any) => a + (e.transferSize || 0), 0))
  writeFileSync('test-results/perf.json', JSON.stringify({ msToDefaultLayer: tModel, transferBytes: transfer, approxFpsDuringOrbit: Math.round(fps), ...stats }, null, 1))
  await page.screenshot({ path: `${SHOTS}/01-default.png` })
  expect(errors, errors.join('\n')).toEqual([])
})

test('search, select, isolate, hide, show all, reset', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await waitModel(page)
  await page.getByTestId('search-input').fill('jantung')
  const first = page.getByTestId('search-results').getByRole('button').first()
  await expect(first).toContainText('heart')
  await first.click()
  await expect(page.getByTestId('info-name')).toHaveText('heart')
  await waitModel(page)
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${SHOTS}/02-heart-selected.png` })
  await page.getByTestId('isolate').click()
  await expect(page.getByTestId('status')).toContainText('Mode isolasi')
  let st = await page.evaluate(() => (window as any).__dal.stats())
  expect(st.visible).toBeLessThan(150)
  await page.screenshot({ path: `${SHOTS}/03-heart-isolated.png` })
  await page.getByTestId('show-all').click()
  await page.getByTestId('hide').click()
  await page.getByTestId('reset').click()
  await expect(page.getByTestId('show-all')).toBeDisabled()
  // nonexistent structure
  await page.getByTestId('search-input').fill('thyroid gland')
  await expect(page.getByTestId('search-results')).toContainText('Tidak ada struktur')
  // layers + system toggle
  await page.getByTestId('layers').getByRole('radio', { name: /Pembuluh dan otak/ }).click()
  await waitModel(page)
  st = await page.evaluate(() => (window as any).__dal.stats())
  expect(st.visible).toBeGreaterThan(500)
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${SHOTS}/04-layer6.png` })
  await page.getByTestId('region').selectOption('head_neck')
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${SHOTS}/05-region-head.png` })
  // click-to-pick on canvas centre
  await page.getByTestId('region').selectOption('all')
  await page.getByTestId('layers').getByRole('radio', { name: /Otot superfisial/ }).click()
  await waitModel(page)
  const box = (await page.getByTestId('viewer-canvas').boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.42)
  await expect(page.getByTestId('info-name')).not.toHaveCount(0)
  await page.screenshot({ path: `${SHOTS}/06-picked.png` })
  await page.getByTestId('about-open').click()
  await expect(page.getByTestId('about')).toContainText('CC Attribution 4.0')
  await page.screenshot({ path: `${SHOTS}/07-about.png` })
  await page.getByTestId('about-close').click()
  await page.getByTestId('theme-toggle').click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${SHOTS}/08-dark.png` })
  expect(errors, errors.join('\n')).toEqual([])
})

test('model load failure shows retry', async ({ page }) => {
  await page.route('**/models/muscular.glb', (r) => r.abort())
  await page.goto('/')
  await expect(page.getByTestId('status')).toContainText('gagal dimuat', { timeout: 60_000 })
  await page.screenshot({ path: `${SHOTS}/09-load-error.png` })
})

test('no WebGL fallback', async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext
    // @ts-ignore
    HTMLCanvasElement.prototype.getContext = function (t: string, ...a: unknown[]) { return /webgl/.test(t) ? null : orig.call(this, t, ...a) }
  })
  await page.goto('/')
  await expect(page.getByTestId('nowebgl')).toBeVisible()
  await page.getByLabel('Cari struktur').fill('femur')
  await expect(page.locator('.results.static')).toContainText('femur')
  await page.screenshot({ path: `${SHOTS}/10-nowebgl.png` })
})

test('demo 3D Slicer: six steps, MPR, presets, threshold, bone model', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await page.getByTestId('mode-slicer').click()
  await expect(page).toHaveURL(/#demo-slicer\/1/)
  await expect(page.getByTestId('demo-step')).toContainText('Muat CTChest')
  await expect(page.getByTestId('slice-axial')).toBeVisible({ timeout: 30_000 })

  await page.getByTestId('step-3').click()
  await page.getByTestId('preset-CT-Lung').click()
  await expect(page.getByTestId('probe')).toContainText('W 1400 / L -500')
  await page.getByTestId('slice-axial').scrollIntoViewIfNeeded()
  const ax = (await page.getByTestId('slice-axial').boundingBox())!
  await page.mouse.move(ax.x + ax.width * 0.2, ax.y + ax.height * 0.4) // paru kanan
  await expect.poll(async () => Number(await page.getByTestId('probe-hu').textContent())).toBeLessThan(-600)
  await expect(page.getByTestId('probe-table')).toContainText('Paru')
  await page.screenshot({ path: `${SHOTS}/13-slicer-presets.png` })

  await page.getByTestId('step-4').click()
  await expect(page.getByTestId('thr-stats')).toContainText('cm³')
  await page.screenshot({ path: `${SHOTS}/14-slicer-threshold.png` })

  await page.getByTestId('next-step').click()
  await expect(page.getByTestId('bone-model')).toHaveAttribute('data-state', 'ready', { timeout: 30_000 })
  await page.screenshot({ path: `${SHOTS}/15-slicer-bone.png` })

  await page.getByTestId('next-step').click()
  await expect(page.getByTestId('stats-table')).toContainText('874,8')

  await page.getByTestId('mode-atlas').click()
  await waitModel(page)
  expect(errors, errors.join('\n')).toEqual([])
})

test('organ detail (HRA): load organ, pick part, switch organ', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/#organ')
  await expect(page.getByTestId('organ-stage')).toHaveAttribute('data-state', 'ready', { timeout: 30_000 })
  await page.getByTestId('organ-parts').getByRole('button', { name: 'mitral valve' }).click()
  await expect(page.locator('.pick')).toHaveText('mitral valve')
  await page.screenshot({ path: `${SHOTS}/16-organ-heart.png` })
  await page.getByTestId('organ-female-reproductive').click()
  await expect(page).toHaveURL(/#organ\/female-reproductive/)
  await expect(page.getByTestId('organ-stage')).toHaveAttribute('data-state', 'ready', { timeout: 30_000 })
  await expect(page.getByTestId('organ-parts')).toContainText('uterus')
  expect(errors, errors.join('\n')).toEqual([])
})

test('mobile layout @mobile', async ({ page }) => {
  const errors = trackErrors(page)
  await page.goto('/')
  await waitModel(page)
  await page.screenshot({ path: `${SHOTS}/11-mobile.png` })
  await page.getByRole('tab', { name: 'Jelajah' }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${SHOTS}/12-mobile-sheet.png` })
  expect(errors, errors.join('\n')).toEqual([])
})

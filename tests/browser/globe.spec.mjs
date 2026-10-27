import { test, expect } from '@playwright/test'

test('dialog returns focus, Escape closes it, and reduced motion remains user-overridable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(
    page.getByRole('button', { name: '播放动画', exact: true }),
  ).toBeVisible()
  const opener = page.getByRole('button', { name: 'Inside the experiment' })
  await opener.click()
  await expect(page.getByRole('button', { name: '关闭说明' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(opener).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await page.getByRole('button', { name: 'Explore the connections' }).click()
  await expect(page.getByRole('combobox')).toHaveValue('12')
  await expect(
    page.getByRole('button', { name: '暂停动画', exact: true }),
  ).toBeVisible()
})

test('route unmount releases WebGL buffers and repeated toggles do not accumulate allocations', async ({
  page,
}) => {
  // Observe actual WebGL allocation/deletion rather than assuming a React unmount frees GPU memory.
  await page.addInitScript(() => {
    const active = { buffers: new Set(), programs: new Set() }
    window.__gpuCounts = () => ({
      buffers: active.buffers.size,
      programs: active.programs.size,
    })
    for (const [suffix, pool] of [
      ['Buffer', active.buffers],
      ['Program', active.programs],
    ]) {
      const prototype = WebGL2RenderingContext.prototype
      const create = prototype[`create${suffix}`],
        remove = prototype[`delete${suffix}`]
      prototype[`create${suffix}`] = function (...args) {
        const resource = create.apply(this, args)
        if (resource) pool.add(resource)
        return resource
      }
      prototype[`delete${suffix}`] = function (resource) {
        pool.delete(resource)
        return remove.call(this, resource)
      }
    }
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  const counts = () => page.evaluate(() => window.__gpuCounts())
  await expect.poll(async () => (await counts()).buffers).toBeGreaterThan(100)
  const baseline = await counts()
  const toggle = page.getByRole('button', { name: 'Connections', exact: true })
  for (let i = 0; i < 4; i++) {
    await toggle.click()
    await expect
      .poll(async () => (await counts()).buffers)
      .toBeLessThan(baseline.buffers - 50)
    await toggle.click()
    await expect
      .poll(async () => (await counts()).buffers)
      .toBe(baseline.buffers)
    await expect
      .poll(async () => (await counts()).programs)
      .toBeLessThanOrEqual(baseline.programs)
  }
  expect(errors).toEqual([])
})

test('mobile controls remain usable without horizontal page overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(
    page.getByRole('link', {
      name: '在 GitHub 查看 Meridian Globe 源码（新窗口）',
    }),
  ).toBeVisible()
  // The DOM controls appear before the lazy WebGL scene; inspect label styles only after its canvas is ready.
  await expect
    .poll(() => page.locator('canvas').evaluate((canvas) => canvas.width))
    .toBeGreaterThan(300)
  await page.getByRole('combobox').selectOption('12')
  await expect(page.getByRole('combobox')).toHaveValue('12')
  await expect(page.locator('[data-ui="city-label"]').locator('..')).toHaveCSS(
    'pointer-events',
    'none',
  )
  await page.getByRole('button', { name: 'Reset view', exact: true }).click()
  await expect(page.getByRole('combobox')).toHaveValue('')
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
})

test('utility-first responsive boundaries and pressed styles preserve the original UI', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const scene = page.getByRole('region', { name: '交互式地球演示' })
  for (const [width, height] of [
    [390, 1000],
    [760, 1000],
    [761, 710],
    [1100, 710],
    [1101, 740],
    [1549, 740],
    [1550, 800],
  ]) {
    await page.setViewportSize({ width, height: 700 })
    await expect(scene).toHaveCSS('height', `${height}px`)
  }
  const toggle = page.getByRole('button', { name: 'Connections', exact: true })
  const knob = toggle.locator('span')
  await expect(knob).toHaveCSS('background-color', 'rgb(121, 107, 196)')
  await expect
    .poll(() =>
      knob.evaluate((el) => getComputedStyle(el, '::after').transform),
    )
    .toBe('matrix(1, 0, 0, 1, 11, 0)')
  await toggle.click()
  await expect(knob).toHaveCSS('background-color', 'rgb(53, 64, 90)')
  await expect
    .poll(() =>
      knob.evaluate((el) => getComputedStyle(el, '::after').transform),
    )
    .toBe('none')
  const speed = page.getByRole('button', { name: '2×', exact: true })
  await speed.click()
  await expect(speed).toHaveCSS('color', 'rgb(213, 207, 255)')
  await expect(page.getByRole('button', { name: '1×', exact: true })).toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  )
  await page
    .getByRole('button', { name: 'Inside the experiment', exact: true })
    .click()
  await expect
    .poll(() =>
      page
        .getByRole('dialog')
        .evaluate((el) => getComputedStyle(el, '::backdrop').backdropFilter),
    )
    .toBe('blur(9px)')
})

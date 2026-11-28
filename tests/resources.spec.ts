import { expect, test } from '@playwright/test'

test.use({ javaScriptEnabled: false })

for (const [width, columns] of [
  [1280, 3],
  [820, 2],
  [390, 1],
]) {
  test(`resources remain visible without JavaScript at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/resources/')
    const cards = page.locator('.ffc-resources-grid > article')
    await expect(cards).toHaveCount(10)
    await expect(cards.first()).toHaveCSS('opacity', '1')
    const bounds = await cards.evaluateAll((elements) =>
      elements.map((el) => {
        const { x, y, width } = el.getBoundingClientRect()
        return { x, y, width }
      })
    )
    expect(new Set(bounds.slice(0, columns).map((rect) => rect.x)).size).toBe(columns)
    expect(bounds[columns].y).toBeGreaterThan(bounds[0].y)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width
    )
    await page.screenshot({ path: testInfo.outputPath('resources.png'), fullPage: true })
    await page.getByRole('link', { name: '« Older Entries', exact: true }).click()
    await expect(page).toHaveURL(/\/resources\/page\/2\/$/)
    await expect(page.locator('.ffc-resources-grid > article').first()).toContainText(
      'God Inhabits Your Praise'
    )
    await page.getByRole('link', { name: 'Next Entries »', exact: true }).click()
    await expect(page).toHaveURL(/\/resources\/$/)
    await page.getByRole('link', { name: 'Challenges of Abundant Living', exact: true }).click()
    await expect(page).toHaveURL(/\/challenges-of-abundant-living\/$/)
  })
}

import { test, expect } from '@playwright/test'

test('the donation page offers PayPal without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  try {
    const page = await context.newPage()
    await page.goto('/donate/')
    const link = page.getByRole('link', { name: 'Donate with PayPal', exact: true })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute(
      'href',
      'https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y'
    )
    await link.click({ trial: true })
  } finally {
    await context.close()
  }
})

for (const mobile of [false, true]) {
  test(`Donate opens one PayPal option on ${mobile ? 'mobile' : 'desktop'}`, async ({ page }) => {
    await page.setViewportSize({ width: mobile ? 390 : 1440, height: 900 })
    await page.goto('/')
    if (mobile)
      await page
        .getByRole('button', { name: 'Toggle menu' })
        .filter({ visible: true })
        .first()
        .click()
    const toggle = page.locator('[data-donate-toggle]:visible').first()
    const menu = toggle.locator('..')
    await expect(menu.getByRole('link', { name: 'PayPal', exact: true })).toBeHidden()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const options = menu.locator(':scope > ul > li > a')
    await expect(options).toHaveCount(1)
    await expect(options).toHaveText('PayPal')
    await expect(options).toHaveAttribute(
      'href',
      'https://www.paypal.com/donate/?hosted_button_id=259HPTKEZQ57Y'
    )
    await expect(options).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(options).toBeHidden()
    await expect(page.getByText('Other ways to Donate', { exact: false })).toHaveCount(0)
  })
}

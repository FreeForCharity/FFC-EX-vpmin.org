import { test, expect } from '@playwright/test'

test('newsletter and volunteering offer email actions without backend forms', async ({ page }) => {
  for (const [route, label, subject] of [
    ['newsletter', 'Subscribe by email', 'Newsletter%20subscription%20request'],
    ['volunteers', 'Ask about volunteering by email', 'Volunteer%20enquiry'],
  ]) {
    await page.goto(`/${route}/`)
    const link = page.locator('.header-content').getByRole('link', { name: label, exact: true })
    await expect(link).toHaveAttribute(
      'href',
      `mailto:info@viewpointministriesinternational.org?subject=${subject}`
    )
    await expect(link).toBeVisible()
    await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)')
    await expect(link).toHaveCSS('text-decoration-line', 'underline')
    await expect(page.locator('.ffc-clone form')).toHaveCount(0)
    await expect(page.locator('a[href*="1FAIpQLSf8arxVgp"]')).toHaveCount(0)
  }
})

test('contact describes email and archived video has a usable watch link', async ({ page }) => {
  await page.goto('/contact-us/')
  await expect(page.getByText('Send your enquiry by email.', { exact: false })).toBeVisible()
  await expect(page.getByText('using the form.', { exact: false })).toHaveCount(0)
  await page.goto('/attitude-of-gratitude/')
  await expect(
    page.getByRole('link', { name: 'Watch this video on YouTube', exact: true })
  ).toHaveAttribute('href', 'https://www.youtube.com/watch?v=u_xt_5raqzg')
  await expect(page.locator('iframe[src*="youtube.com/embed"]')).toHaveCount(0)
})

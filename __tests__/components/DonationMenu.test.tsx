import { fireEvent, render, screen } from '@testing-library/react'
import DonationMenu from '../../src/components/donation-menu'

it('opens on click and Space, and closes on Escape and outside click', () => {
  render(
    <>
      <ul>
        <li className="menu-item-87" data-donate-open="false">
          <a href="/donate/" role="button" data-donate-toggle aria-expanded="false">
            Donate
          </a>
          <ul>
            <li>
              <a href="https://www.paypal.com/donate/">PayPal</a>
            </li>
          </ul>
        </li>
      </ul>
      <DonationMenu />
    </>
  )
  const toggle = screen.getByRole('button', { name: 'Donate' })
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  fireEvent.keyDown(screen.getByRole('link', { name: 'PayPal' }), { key: 'Escape' })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(toggle).toHaveFocus()
  fireEvent.keyDown(toggle, { key: ' ' })
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(document.body)
  expect(toggle).toHaveAttribute('aria-expanded', 'false')

  // Mobile navigation is cloned after the hamburger opens.
  const clone = toggle.closest('li')!.cloneNode(true) as HTMLElement
  toggle.closest('ul')!.appendChild(clone)
  const mobileToggle = clone.querySelector<HTMLElement>('[data-donate-toggle]')!
  fireEvent.click(mobileToggle)
  expect(mobileToggle).toHaveAttribute('aria-expanded', 'true')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

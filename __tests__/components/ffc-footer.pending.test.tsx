import React from 'react'
import { render, screen, within } from '@testing-library/react'
import FfcFooter from '@/components/ffc-footer'
import { PENDING_TEXT, siteConfig } from '@/lib/site.config'
import { asCharitySite, CHARITY, restoreSiteConfig } from '../helpers/site-identity'

// Ported from FreeForCharity/FFC-IN-FFC_Single_Page_Template#483: a
// footer-standard field the charity has not supplied yet is listed in
// `siteConfig.pending`, keeps an empty value, and renders PENDING_TEXT as
// plain text — never a link. On this site the placeholders live in the FFC
// attribution footer.

function placeholders(container: HTMLElement): HTMLElement[] {
  const notes = within(container).queryAllByText(PENDING_TEXT)
  for (const note of notes) expect(note.closest('a')).toBeNull()
  return notes
}

describe('ffc-footer pending placeholders', () => {
  afterEach(restoreSiteConfig)

  it('shows one plain-text placeholder per pending field in the checked-in config', () => {
    const { container } = render(<FfcFooter />)
    expect(placeholders(container)).toHaveLength(siteConfig.pending?.length ?? 0)
  })

  it('shows the charity name and EIN, never the template identity', () => {
    const { container } = render(<FfcFooter />)
    expect(screen.getByText(`${siteConfig.name} — EIN ${siteConfig.ein}`)).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/46-?2471893|Free For Charity — EIN/)
  })

  it('links the Supported Charity Login to the supporting org hub from siteConfig', () => {
    render(<FfcFooter />)
    expect(screen.getByText('Supported Charity Login').closest('a')).toHaveAttribute(
      'href',
      siteConfig.supportedBy.hubUrl
    )
  })

  it('renders no placeholder when nothing is pending', () => {
    asCharitySite()
    const { container } = render(<FfcFooter />)
    expect(placeholders(container)).toHaveLength(0)
  })

  it('labels each pending field', () => {
    asCharitySite({ pending: ['guidestar', 'address'] })
    render(<FfcFooter />)
    for (const label of ['GuideStar / Candid Profile:', 'Address:']) {
      const item = screen.getByText(label).closest('li') as HTMLElement
      expect(within(item).getByText(PENDING_TEXT)).toBeInTheDocument()
    }
  })

  it('links the Candid profile only when the charity has one and it is not pending', () => {
    const PROFILE = 'https://www.guidestar.org/profile/12-3456789'
    asCharitySite({ guidestar: { profileUrl: PROFILE, directProfileUrl: '' } })
    const { unmount } = render(<FfcFooter />)
    expect(screen.getByText(`${CHARITY.name} — EIN ${CHARITY.ein}`).closest('a')).toHaveAttribute(
      'href',
      PROFILE
    )
    unmount()

    asCharitySite({ guidestar: { profileUrl: '', directProfileUrl: '' }, pending: ['guidestar'] })
    const { container } = render(<FfcFooter />)
    expect(container.innerHTML).not.toContain('guidestar.org')
  })
})

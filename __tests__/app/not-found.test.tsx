import React from 'react'
import { render, screen } from '@testing-library/react'
import NotFound, { metadata } from '@/app/not-found'
import { siteConfig } from '@/lib/site.config'

describe('not-found page', () => {
  it('renders branded 404 copy', () => {
    render(<NotFound />)
    expect(screen.getByRole('heading', { name: /can.?t find that page/i })).toBeInTheDocument()
    // Substring match (not a RegExp built from config) so a fork name with
    // regex metacharacters can't break or throw.
    expect(screen.getByText(siteConfig.name, { exact: false })).toBeInTheDocument()
  })

  it('links to the homepage and the disclosure path', () => {
    render(<NotFound />)
    expect(screen.getByRole('link', { name: /go to homepage/i })).toHaveAttribute('href', '/')
    // Compared without a trailing slash on either side. `next.config.ts` sets
    // `trailingSlash: true` and the real build emits
    // `href="/vulnerability-disclosure-policy/"` — verified in out/404.html —
    // but jest does not load next.config, so <Link> here applies Next's
    // default normalization and strips it. Asserting the exact string makes
    // this test agree with the build only while the config default happens to
    // match, which is not what it is trying to check: that the button points
    // at the disclosure path.
    const withoutSlash = (v: string) => v.replace(/\/$/, '')
    expect(
      withoutSlash(
        screen.getByRole('link', { name: /report an issue/i }).getAttribute('href') ?? ''
      )
    ).toBe(withoutSlash(siteConfig.vulnerabilityDisclosurePath))
  })

  it('is excluded from search indexing', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})

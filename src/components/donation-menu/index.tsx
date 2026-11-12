'use client'

import { useEffect } from 'react'

export default function DonationMenu() {
  useEffect(() => {
    const selector = '[data-donate-toggle]'
    const setOpen = (toggle: HTMLElement, open: boolean) => {
      toggle.setAttribute('aria-expanded', String(open))
      toggle.closest('li')?.setAttribute('data-donate-open', String(open))
    }
    const closeMenus = (except?: HTMLElement) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((toggle) => {
        if (toggle !== except) setOpen(toggle, false)
      })
    }
    // Delegation also handles menus cloned by the mobile hamburger after load.
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const toggle = target?.closest<HTMLElement>(selector)
      if (toggle) {
        event.preventDefault()
        const open = toggle.getAttribute('aria-expanded') !== 'true'
        closeMenus(toggle)
        setOpen(toggle, open)
      } else if (!target?.closest('.menu-item-87')) {
        closeMenus()
      }
    }
    const keydown = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const toggle = target?.closest<HTMLElement>(selector)
      if (toggle && event.key === ' ') {
        event.preventDefault()
        toggle.click()
      }
      if (event.key === 'Escape') {
        const parent = target?.closest('.menu-item-87')
        parent?.querySelector<HTMLElement>(selector)?.focus()
        closeMenus()
      }
    }
    document.addEventListener('click', click)
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('click', click)
      document.removeEventListener('keydown', keydown)
    }
  }, [])
  return null
}

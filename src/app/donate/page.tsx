import type { Metadata } from 'next'
import { loadCloneContent } from '@/lib/clone-content'
import { pageMetadata } from '@/lib/page-metadata'

// The captured page body is generated; the donation metadata below reflects
// the owner-approved PayPal-only donation flow.
export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Donate | Viewpoint Ministries International',
    description: 'Support Viewpoint Ministries International with a donation through PayPal.',
    canonical: '/donate/',
  }),
  title: { absolute: 'Donate | Viewpoint Ministries International' },
}

export default function Page() {
  return (
    <div
      className="ffc-clone wp-singular page-template-default page page-id-67 wp-theme-Divi et-tb-has-template et-tb-has-header et-tb-has-footer dtb_blog_default toolbox_menu4 et_button_no_icon et_pb_button_helper_class et_cover_background et_pb_gutter et_pb_gutters3 et_pb_pagebuilder_layout et_no_sidebar et_divi_theme et-db"
      dangerouslySetInnerHTML={{ __html: loadCloneContent('donate') }}
    />
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadCloneContent } from '@/lib/clone-content'
import { pageMetadata } from '@/lib/page-metadata'
import { resourcePageCount, resourcePagePath } from '@/lib/resources-content'

type Props = { params: Promise<{ page: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return Array.from({ length: resourcePageCount - 1 }, (_, index) => ({
    page: String(index + 2),
  }))
}

function pageNumber(value: string): number {
  const page = Number(value)
  if (!/^\d+$/.test(value) || page < 2 || page > resourcePageCount) notFound()
  return page
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = pageNumber((await params).page)
  return pageMetadata({
    title: `Resources – Page ${page}`,
    description:
      'Explore articles and practical Christian living resources from Viewpoint Ministries International.',
    canonical: resourcePagePath(page),
  })
}

export default async function Page({ params }: Props) {
  const page = pageNumber((await params).page)
  return (
    <div
      className="ffc-clone wp-singular page-template-default page page-id-62 wp-theme-Divi et-tb-has-template et-tb-has-header et-tb-has-footer dtb_blog_default toolbox_menu4 et_button_no_icon et_pb_button_helper_class et_cover_background et_pb_gutter et_pb_gutters3 et_pb_pagebuilder_layout et_no_sidebar et_divi_theme et-db"
      dangerouslySetInnerHTML={{ __html: loadCloneContent(`resources/page/${page}`) }}
    />
  )
}

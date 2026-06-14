import { Helmet } from 'react-helmet-async'
import { APP_NAME } from '../lib/constants'

interface PageMetaProps {
  title?: string
  description?: string
  ogImage?: string
  canonical?: string
}

export default function PageMeta({ title, description, ogImage, canonical }: PageMetaProps) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} - Managed Hosting for Solo Entrepreneurs`
  const desc = description || 'Get a live custom website with domain and SSL in minutes. No code required. Starting at P250/month.'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  )
}

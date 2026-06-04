import { Helmet } from "react-helmet-async"

interface SEOProps {
  title: string
  description?: string
  ogImage?: string
  ogType?: "website" | "article"
  lang?: "ar" | "en"
  canonicalPath?: string
}

const BASE_URL = "https://edara-prep.com"
const DEFAULT_IMAGE = "/og-image.svg"

export function SEO({
  title,
  description,
  ogImage,
  ogType = "website",
  lang = "ar",
  canonicalPath,
}: SEOProps) {
  const fullTitle = title.includes("إدارة بريب") ? title : `${title} | إدارة بريب`
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/"
  const canonical = canonicalPath || pathname
  const canonicalUrl = `${BASE_URL}${canonical}`
  const url = typeof window !== "undefined" ? window.location.href : canonicalUrl
  const image = ogImage || DEFAULT_IMAGE
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ogType === "article" ? "Article" : "WebSite",
    name: fullTitle,
    description,
    url: canonicalUrl,
    image: fullImage,
    publisher: {
      "@type": "Organization",
      name: "إدارة بريب",
      url: BASE_URL,
      logo: `${BASE_URL}/og-image.svg`,
    },
    inLanguage: lang === "ar" ? "ar-SA" : "en-US",
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      <link rel="canonical" href={canonicalUrl} />

      <link rel="alternate" hrefLang="ar" href={`${BASE_URL}${canonical}`} />
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}${canonical}`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${canonical}`} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:locale" content={lang === "ar" ? "ar_SA" : "en_US"} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="إدارة بريب" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={fullImage} />

      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  )
}

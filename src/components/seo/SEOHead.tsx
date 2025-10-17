import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: object
}

export function SEOHead({
  title = "Ubetanation - Premier IT Solutions Company",
  description = "Leading IT solutions company specializing in web development, mobile apps, and digital transformation. Transform your ideas into powerful digital solutions.",
  keywords = [],
  canonical,
  ogImage = "/og-image.jpg",
  noIndex = false,
  structuredData
}: SEOHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Ubetanation" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ubetanation" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={noIndex ? "noindex,nofollow" : "index,follow"} 
      />
      
      {/* Additional SEO tags */}
      <meta name="theme-color" content="#667eea" />
      <meta name="msapplication-TileColor" content="#667eea" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  )
}
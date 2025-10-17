import Script from 'next/script'

interface OrganizationSchema {
  "@context": "https://schema.org"
  "@type": "Organization"
  name: string
  url: string
  logo?: string
  description?: string
  address?: {
    "@type": "PostalAddress"
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  contactPoint?: {
    "@type": "ContactPoint"
    telephone?: string
    contactType: string
    email?: string
  }
  sameAs?: string[]
}

interface WebsiteSchema {
  "@context": "https://schema.org"
  "@type": "WebSite"
  name: string
  url: string
  description?: string
  potentialAction?: {
    "@type": "SearchAction"
    target: string
    "query-input": string
  }
}

interface BlogPostSchema {
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  headline: string
  description?: string
  image?: string[]
  datePublished: string
  dateModified?: string
  author: {
    "@type": "Person" | "Organization"
    name: string
    url?: string
  }
  publisher: {
    "@type": "Organization"
    name: string
    logo?: {
      "@type": "ImageObject"
      url: string
      width?: number
      height?: number
    }
  }
  mainEntityOfPage?: {
    "@type": "WebPage"
    "@id": string
  }
  articleSection?: string
  keywords?: string[]
}

interface ServiceSchema {
  "@context": "https://schema.org"
  "@type": "Service"
  name: string
  description: string
  provider: {
    "@type": "Organization"
    name: string
    url?: string
  }
  serviceType: string
  areaServed?: string
  availableChannel?: {
    "@type": "ServiceChannel"
    serviceUrl: string
    serviceSupportedCountry: string
  }
}

interface FAQSchema {
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity: Array<{
    "@type": "Question"
    name: string
    acceptedAnswer: {
      "@type": "Answer"
      text: string
    }
  }>
}

interface BreadcrumbSchema {
  "@context": "https://schema.org"
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item?: string
  }>
}

type StructuredDataProps = {
  data: OrganizationSchema | WebsiteSchema | BlogPostSchema | ServiceSchema | FAQSchema | BreadcrumbSchema | Array<any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  )
}

export function OrganizationStructuredData() {
  const organizationData: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ubetanation",
    url: "https://ubetanation.com",
    logo: "https://ubetanation.com/logo.png",
    description: "Modern IT solutions company providing cutting-edge technology services and digital transformation solutions.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Global",
      addressCountry: "Worldwide"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@ubetanation.com"
    },
    sameAs: [
      "https://linkedin.com/company/ubetanation",
      "https://twitter.com/ubetanation",
      "https://github.com/ubetanation"
    ]
  }

  return <StructuredData data={organizationData} />
}

export function WebsiteStructuredData() {
  const websiteData: WebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ubetanation - IT Solutions & Services",
    url: "https://ubetanation.com",
    description: "Modern IT solutions company providing cutting-edge technology services and digital transformation solutions.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ubetanation.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return <StructuredData data={websiteData} />
}

export function BlogPostStructuredData({
  title,
  description,
  publishedAt,
  updatedAt,
  slug,
  imageUrl,
  tags
}: {
  title: string
  description?: string
  publishedAt: string
  updatedAt?: string
  slug: string
  imageUrl?: string
  tags?: string[]
}) {
  const blogPostData: BlogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Organization",
      name: "Ubetanation",
      url: "https://ubetanation.com"
    },
    publisher: {
      "@type": "Organization",
      name: "Ubetanation",
      logo: {
        "@type": "ImageObject",
        url: "https://ubetanation.com/logo.png",
        width: 200,
        height: 200
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ubetanation.com/blog/${slug}`
    },
    articleSection: "Technology",
    keywords: tags
  }

  return <StructuredData data={blogPostData} />
}

export function ServiceStructuredData({
  name,
  description,
  serviceType
}: {
  name: string
  description: string
  serviceType: string
}) {
  const serviceData: ServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    provider: {
      "@type": "Organization",
      name: "Ubetanation",
      url: "https://ubetanation.com"
    },
    serviceType: serviceType,
    areaServed: "Worldwide",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://ubetanation.com/contact",
      serviceSupportedCountry: "Worldwide"
    }
  }

  return <StructuredData data={serviceData} />
}

export function FAQStructuredData({
  faqs
}: {
  faqs: Array<{ question: string; answer: string }>
}) {
  const faqData: FAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question" as const,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: faq.answer
      }
    }))
  }

  return <StructuredData data={faqData} />
}

export function BreadcrumbStructuredData({
  items
}: {
  items: Array<{ name: string; url?: string }>
}) {
  const breadcrumbData: BreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return <StructuredData data={breadcrumbData} />
}
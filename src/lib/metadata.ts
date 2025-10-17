import { Metadata } from 'next'
import { metaDescriptions, pageTitle, seoKeywords } from '@/data/seo-keywords'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  noIndex?: boolean
  ogImage?: string
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    noIndex = false,
    ogImage = '/og-image.jpg'
  } = config

  return {
    title,
    description,
    keywords: [...keywords, ...seoKeywords.primary, ...seoKeywords.secondary],
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Ubetanation',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@ubetanation',
      images: [ogImage]
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }
}

export const generatePageMetadata = {
  services: (): Metadata => generateMetadata({
    title: pageTitle.services,
    description: metaDescriptions.services,
    keywords: [...seoKeywords.services, ...seoKeywords.technical],
    canonical: 'https://ubetanation.com/services'
  }),

  portfolio: (): Metadata => generateMetadata({
    title: pageTitle.portfolio,
    description: metaDescriptions.portfolio,
    keywords: [...seoKeywords.industry, ...seoKeywords.technical],
    canonical: 'https://ubetanation.com/portfolio'
  }),

  about: (): Metadata => generateMetadata({
    title: pageTitle.about,
    description: metaDescriptions.about,
    keywords: [...seoKeywords.primary, ...seoKeywords.local],
    canonical: 'https://ubetanation.com/about'
  }),

  contact: (): Metadata => generateMetadata({
    title: pageTitle.contact,
    description: metaDescriptions.contact,
    keywords: [...seoKeywords.primary, ...seoKeywords.local],
    canonical: 'https://ubetanation.com/contact'
  }),

  blog: (): Metadata => generateMetadata({
    title: pageTitle.blog,
    description: metaDescriptions.blog,
    keywords: [...seoKeywords.technical, ...seoKeywords.industry],
    canonical: 'https://ubetanation.com/blog'
  })
}
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/private/',
        '/_next/',
        '/uploads/temp/',
      ],
    },
    sitemap: 'https://ubetanation.com/sitemap.xml',
    host: 'https://ubetanation.com',
  }
}
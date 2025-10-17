import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ubetanation.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  try {
    // Dynamic blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        status: 'published'
      },
      select: {
        id: true,
        updatedAt: true,
      },
    })

    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    // Dynamic portfolio projects
    const projects = await prisma.project.findMany({
      where: {
        status: 'completed'
      },
      select: {
        id: true,
        updatedAt: true,
      },
    })

    const portfolioPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/portfolio/${project.id}`,
      lastModified: project.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticPages, ...blogPages, ...portfolioPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages if database fails
    return staticPages
  }
}
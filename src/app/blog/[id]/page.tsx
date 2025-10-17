import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import BlogDetailClient from '@/components/blog/BlogDetailClient'
import { BlogPostStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  coverImage?: string
  tags: string[]
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  // Blog posts use string IDs (cuid)
  if (!id || typeof id !== 'string') {
    return {
      title: 'Post Not Found - Ubetanation Blog'
    }
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: id },
      select: {
        title: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        createdAt: true
      }
    })

    if (!post) {
      return {
        title: 'Post Not Found - Ubetanation Blog'
      }
    }

    return {
      title: `${post.title} - Ubetanation Blog`,
      description: post.excerpt,
      keywords: JSON.parse(post.tags || '[]').join(', '),
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        images: post.coverImage ? [{ url: post.coverImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : [],
      }
    }
  } catch (error) {
    return {
      title: 'Error - Ubetanation Blog'
    }
  }
}

async function getPost(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/public/blog/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return null
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const postId = parseInt(id)
  
  if (isNaN(postId)) {
    notFound()
  }

  const data = await getPost(postId)
  
  if (!data || !data.post) {
    notFound()
  }

  const { post, relatedPosts = [] } = data

  return (
    <>
      <BlogPostStructuredData
        title={post.title}
        description={post.excerpt}
        publishedAt={post.createdAt}
        updatedAt={post.updatedAt}
        slug={id}
        imageUrl={post.coverImage}
        tags={post.tags}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://ubetanation.com" },
          { name: "Blog", url: "https://ubetanation.com/blog" },
          { name: post.title }
        ]}
      />
      <BlogDetailClient post={post} relatedPosts={relatedPosts} />
    </>
  )
}
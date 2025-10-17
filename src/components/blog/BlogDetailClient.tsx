"use client"

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Tag, ArrowLeft, User, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer'
import SocialShare from '@/components/blog/SocialShare'

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

interface BlogDetailClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative h-96 rounded-3xl overflow-hidden mb-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-medium">Ubetanation Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Social Share */}
            <SocialShare 
              title={post.title} 
              url={`${typeof window !== 'undefined' ? window.location.href : ''}`}
            />
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 md:p-12 border-0 shadow-lg mb-12">
              <MarkdownRenderer content={post.content} />
            </Card>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 2).map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/blog/${relatedPost.id}`}>
                      <div className="relative h-48">
                        {relatedPost.coverImage ? (
                          <Image
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-blue-500" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                          <span>{formatDate(relatedPost.createdAt)}</span>
                          <span>{getReadingTime(relatedPost.content)} min read</span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center py-16 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl border border-white/20"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Let's discuss how our innovative solutions can help you achieve your digital goals 
              and drive growth for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Get in Touch
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">
                  Our Services
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
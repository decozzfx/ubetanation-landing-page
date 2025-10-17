"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, Search, Tag, User, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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

const categories = ['All', 'Software Development', 'Cloud Solutions', 'Digital Transformation', 'AI/ML', 'Cybersecurity']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  const postsPerPage = 6

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    let filtered = posts.filter(post => post.status === 'published')

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => 
        post.tags.some(tag => 
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
    setCurrentPage(1)
  }, [posts, selectedCategory, searchTerm])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/public/blog')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

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

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading our latest insights...</p>
      </div>
    )
  }

  return (
    <>
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12 space-y-6"
      >
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-300 hover:scale-105"
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Info */}
        <div className="text-center text-slate-600 dark:text-slate-400">
          {filteredPosts.length === 0 && !loading ? (
            <p>No articles found matching your criteria.</p>
          ) : (
            <p>
              Showing {currentPosts.length} of {filteredPosts.length} articles
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          )}
        </div>
      </motion.div>

      {/* Blog Posts Grid */}
      {currentPosts.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {currentPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">Article</p>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex flex-col h-full">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-3 text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getReadingTime(post.content)} min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Read More Button */}
                  <Button asChild className="w-full mt-auto">
                    <Link href={`/blog/${post.id}`}>
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : !loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchTerm || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Check back soon for our latest insights and articles.'}
          </p>
          {(searchTerm || selectedCategory !== 'All') && (
            <div className="mt-6 space-x-3">
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
              {selectedCategory !== 'All' && (
                <Button variant="outline" onClick={() => setSelectedCategory('All')}>
                  Show All Categories
                </Button>
              )}
            </div>
          )}
        </motion.div>
      ) : null}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-2 mt-12"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              onClick={() => paginate(pageNumber)}
              className="w-10 h-10 p-0"
            >
              {pageNumber}
            </Button>
          ))}
        </motion.div>
      )}
    </>
  )
}
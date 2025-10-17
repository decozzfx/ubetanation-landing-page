"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string;
  status: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/blog");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setError(null);
      } else {
        setError("Failed to fetch blog posts");
      }
    } catch (err) {
      setError("Failed to fetch blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert("Failed to delete blog post");
      }
    } catch (err) {
      alert("Failed to delete blog post");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const response = await fetch(`/api/admin/blog/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setPosts(posts.map(p => 
          p.id === id ? { ...p, status: newStatus } : p
        ));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const parseTags = (tagString: string): string[] => {
    try {
      return JSON.parse(tagString);
    } catch {
      return tagString.split(",").map(t => t.trim()).filter(t => t);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600 mt-2">
              Manage your blog content
            </p>
          </div>
          <Link href="/admin/blog/new">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-4 w-full rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Blog Posts List */}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No blog posts yet</h3>
                <p className="mt-2 text-gray-500">Get started by creating your first blog post.</p>
                <div className="mt-6">
                  <Link href="/admin/blog/new">
                    <Button>New Post</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-1 text-lg">
                            {post.title}
                          </CardTitle>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <span>Created: {formatDate(post.createdAt)}</span>
                            {post.updatedAt !== post.createdAt && (
                              <span>• Updated: {formatDate(post.updatedAt)}</span>
                            )}
                            <span>• Slug: /{post.slug}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusToggle(post.id, post.status)}
                            className={
                              post.status === 'published' 
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                            }
                          >
                            {post.status === 'published' ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Published
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Draft
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {/* Cover Image */}
                        {post.coverImage && (
                          <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {post.excerpt || truncateContent(post.content)}
                        </p>

                        {/* Tags */}
                        {post.tags && parseTags(post.tags).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {parseTags(post.tags).map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Preview
                              </Button>
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/blog/${post.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(post.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
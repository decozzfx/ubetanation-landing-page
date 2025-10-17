"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus, Pencil, Trash2, Eye, Search } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  featured: boolean;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/testimonials?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials);
        setTotalPages(data.pagination.pages);
        setError(null);
      } else {
        setError("Failed to fetch testimonials");
      }
    } catch (err) {
      setError("Failed to fetch testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTestimonials();
      } else {
        setError("Failed to delete testimonial");
      }
    } catch (err) {
      setError("Failed to delete testimonial");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500 hover:bg-green-600";
      case "draft":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading testimonials...</div>
      ) : (
        <>
          <div className="grid gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar || testimonial.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                          {testimonial.company && ` at ${testimonial.company}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">{renderStars(testimonial.rating)}</div>
                          <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {testimonial.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      <Badge className={getStatusColor(testimonial.status)}>
                        {testimonial.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{testimonial.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Order: {testimonial.order} | Created: {new Date(testimonial.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/testimonials/${testimonial.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(testimonial.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Star } from "lucide-react";
import Link from "next/link";

export default function NewTestimonialPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatar: "",
    featured: false,
    status: "published",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/testimonials");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create testimonial");
      }
    } catch (err) {
      setError("Failed to create testimonial");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
        }`}
        onClick={() => handleInputChange("rating", i + 1)}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link href="/admin/testimonials">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Testimonials
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Testimonial</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Testimonial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Testimonial Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="avatar">Avatar (URL or Initials)</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange("avatar", e.target.value)}
                    placeholder="https://example.com/avatar.jpg or JD"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {renderStars(formData.rating)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Click stars to set rating</p>
                </div>

                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Featured Testimonial</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Creating..." : "Create Testimonial"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
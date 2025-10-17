"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.string().optional(),
  status: z.enum(["published", "draft"]),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function NewBlogPostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "draft",
    },
  });

  // Auto-generate slug from title
  const watchTitle = watch("title");
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    if (title && !watch("slug")) {
      setValue("slug", generateSlug(title));
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert comma-separated tags to array
      const tags = data.tags
        ? data.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const blogData = {
        ...data,
        tags,
        coverImage: data.coverImage || null,
        excerpt: data.excerpt || "",
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      };

      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        router.push("/admin/blog");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create blog post");
      }
    } catch (err) {
      setError("Failed to create blog post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
            <p className="text-gray-600 mt-2">
              Create a new blog post with markdown support
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push("/admin/blog")}
          >
            Cancel
          </Button>
        </div>

        {/* Error Message */}
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    onChange={handleTitleChange}
                    disabled={isLoading}
                    placeholder="Enter blog post title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug*</Label>
                  <Input
                    id="slug"
                    {...register("slug")}
                    disabled={isLoading}
                    placeholder="url-slug-for-post"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    This will be the URL: /blog/{watch("slug") || "your-slug"}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...register("excerpt")}
                  disabled={isLoading}
                  placeholder="Brief description of the blog post (optional)"
                  className="min-h-[80px]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Used for previews and meta descriptions
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={watch("status")} 
                    onValueChange={(value) => setValue("status", value as "published" | "draft")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    {...register("tags")}
                    disabled={isLoading}
                    placeholder="react, nextjs, tutorial"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter tags separated by commas
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  type="url"
                  {...register("coverImage")}
                  disabled={isLoading}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.coverImage && (
                  <p className="text-sm text-red-600 mt-1">{errors.coverImage.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content*</CardTitle>
              <p className="text-sm text-gray-600">
                Write your blog post content in Markdown format
              </p>
            </CardHeader>
            <CardContent>
              <Controller
                name="content"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div data-color-mode="light">
                    <MDEditor
                      value={value}
                      onChange={(val) => onChange(val || "")}
                      preview="edit"
                      height={400}
                      visibleDragbar={false}
                    />
                  </div>
                )}
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <p className="text-sm text-gray-600">
                Optimize your blog post for search engines (optional)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register("metaTitle")}
                  disabled={isLoading}
                  placeholder="SEO-optimized title"
                />
                <p className="text-sm text-gray-500 mt-1">
                  If empty, the blog title will be used
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register("metaDescription")}
                  disabled={isLoading}
                  placeholder="Brief description for search engines"
                  className="min-h-[80px]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  If empty, the excerpt will be used
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/blog")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.string().min(1, "At least one technology is required"),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  repoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverImage: z.string().optional(),
  goals: z.string().optional(),
  challenges: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(["published", "draft"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  technologies: string;
  demoUrl?: string;
  repoUrl?: string;
  coverImage: string;
  goals?: string;
  challenges?: string;
  solution?: string;
  results?: string;
  featured: boolean;
  status: string;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      featured: false,
      status: "draft",
    },
  });

  useEffect(() => {
    const loadProject = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/admin/projects/${id}`);
        
        if (response.ok) {
          const projectData = await response.json();
          setProject(projectData);
          
          // Parse technologies back to comma-separated string
          let technologiesString = "";
          try {
            const techArray = JSON.parse(projectData.technologies);
            technologiesString = Array.isArray(techArray) ? techArray.join(", ") : projectData.technologies;
          } catch {
            technologiesString = projectData.technologies;
          }

          // Populate form with existing data
          reset({
            title: projectData.title,
            client: projectData.client,
            description: projectData.description,
            technologies: technologiesString,
            demoUrl: projectData.demoUrl || "",
            repoUrl: projectData.repoUrl || "",
            coverImage: projectData.coverImage || "",
            goals: projectData.goals || "",
            challenges: projectData.challenges || "",
            solution: projectData.solution || "",
            results: projectData.results || "",
            featured: projectData.featured,
            status: projectData.status as "published" | "draft",
          });
        } else if (response.status === 404) {
          setError("Project not found");
        } else {
          setError("Failed to load project");
        }
      } catch (err) {
        setError("Failed to load project");
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProject();
  }, [params, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { id } = await params;
      
      // Convert comma-separated technologies to array
      const technologies = data.technologies
        .split(",")
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      const projectData = {
        ...data,
        technologies,
        demoUrl: data.demoUrl || null,
        repoUrl: data.repoUrl || null,
      };

      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        router.push("/admin/projects");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update project");
      }
    } catch (err) {
      setError("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProject) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !project) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{error}</h3>
            <div className="mt-6">
              <Button onClick={() => router.push("/admin/projects")}>
                Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
            <p className="text-gray-600 mt-2">
              {project?.title}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push("/admin/projects")}
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
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title*</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    disabled={isLoading}
                    placeholder="Enter project title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="client">Client*</Label>
                  <Input
                    id="client"
                    {...register("client")}
                    disabled={isLoading}
                    placeholder="Client or company name"
                  />
                  {errors.client && (
                    <p className="text-sm text-red-600 mt-1">{errors.client.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    disabled={isLoading}
                    placeholder="Brief project description"
                    className="min-h-[100px]"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="technologies">Technologies* (comma-separated)</Label>
                  <Input
                    id="technologies"
                    {...register("technologies")}
                    disabled={isLoading}
                    placeholder="React, Node.js, MongoDB, etc."
                  />
                  {errors.technologies && (
                    <p className="text-sm text-red-600 mt-1">{errors.technologies.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Enter technologies separated by commas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Links & Media */}
            <Card>
              <CardHeader>
                <CardTitle>Links & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input
                    id="demoUrl"
                    type="url"
                    {...register("demoUrl")}
                    disabled={isLoading}
                    placeholder="https://example.com"
                  />
                  {errors.demoUrl && (
                    <p className="text-sm text-red-600 mt-1">{errors.demoUrl.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="repoUrl">Repository URL</Label>
                  <Input
                    id="repoUrl"
                    type="url"
                    {...register("repoUrl")}
                    disabled={isLoading}
                    placeholder="https://github.com/username/repo"
                  />
                  {errors.repoUrl && (
                    <p className="text-sm text-red-600 mt-1">{errors.repoUrl.message}</p>
                  )}
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
                  <p className="text-sm text-gray-500 mt-1">
                    Direct link to project cover image
                  </p>
                </div>

                {/* Status and Featured */}
                <div className="space-y-3">
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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={watch("featured")}
                      onCheckedChange={(checked) => setValue("featured", !!checked)}
                    />
                    <Label htmlFor="featured">Featured Project</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <p className="text-sm text-gray-600">
                Additional information about the project (optional)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goals">Goals & Objectives</Label>
                <Textarea
                  id="goals"
                  {...register("goals")}
                  disabled={isLoading}
                  placeholder="What were the main goals of this project?"
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="challenges">Challenges</Label>
                <Textarea
                  id="challenges"
                  {...register("challenges")}
                  disabled={isLoading}
                  placeholder="What challenges did you face?"
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="solution">Solution</Label>
                <Textarea
                  id="solution"
                  {...register("solution")}
                  disabled={isLoading}
                  placeholder="How did you solve the challenges?"
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="results">Results</Label>
                <Textarea
                  id="results"
                  {...register("results")}
                  disabled={isLoading}
                  placeholder="What were the outcomes and impact?"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/projects")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
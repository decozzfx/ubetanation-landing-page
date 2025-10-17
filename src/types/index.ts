// Common type definitions for the Ubetanation landing page

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

// Prisma-based types (matching database schema)
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  technologies: string; // JSON string, parsed to string[]
  demoUrl?: string | null;
  repoUrl?: string | null;
  coverImage: string;
  galleryImages?: string | null; // JSON string, parsed to string[]
  goals?: string | null;
  challenges?: string | null;
  solution?: string | null;
  results?: string | null;
  featured: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string | null;
  tags: string; // JSON string, parsed to string[]
  status: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  page: string;
  views: number;
  referrer?: string | null;
  country?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  date: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: Date;
}

// Form types (for client-side forms)
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface ProjectForm {
  title: string;
  client: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
  goals?: string;
  challenges?: string;
  solution?: string;
  results?: string;
  featured: boolean;
  status: 'draft' | 'published';
}

export interface BlogPostForm {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
}
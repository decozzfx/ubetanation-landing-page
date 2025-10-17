import { PrismaClient } from "../../generated/prisma";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Utility functions for JSON field parsing
export const parseJsonArray = (jsonString: string | null): string[] => {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

export const stringifyArray = (array: string[]): string => {
  return JSON.stringify(array);
};

// Database utility functions
export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  // Remove markdown formatting and HTML tags
  const plainText = content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  if (plainText.length <= maxLength) return plainText;
  
  return plainText.substring(0, maxLength).replace(/\s+\w*$/, "") + "...";
};
import type { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About Us - Ubetanation | Leading IT Solutions Company",
  description: "Learn about Ubetanation's mission to transform businesses through innovative technology solutions. Discover our values, team, and commitment to excellence.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
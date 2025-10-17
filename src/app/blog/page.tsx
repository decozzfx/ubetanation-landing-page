"use client";

import { motion } from "framer-motion";
import BlogList from "@/components/blog/BlogList";
import Navbar from "@/components/Navbar";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Stay updated with the latest technology trends, software development insights, 
            and digital transformation strategies from our expert team.
          </p>
        </motion.div>

        {/* Blog List */}
        <BlogList />
      </div>
    </div>
  );
}
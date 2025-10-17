"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { portfolioProjects, portfolioCategories, type PortfolioProject } from "@/data/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function PortfolioPage() {
  const { t, language } = useLanguage();
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>(portfolioProjects);
  const [selectedCategory, setSelectedCategory] = useState(0); // Use index instead of string

  const categories = language === "id" ? portfolioCategories.id : portfolioCategories.en;

  useEffect(() => {
    if (selectedCategory === 0) {
      setFilteredProjects(portfolioProjects);
    } else {
      const categoryName = categories[selectedCategory];
      setFilteredProjects(
        portfolioProjects.filter(project =>
          language === "id" ? project.category.id === categoryName : project.category.en === categoryName
        )
      );
    }
  }, [selectedCategory, language]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "live":
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      case "planned":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
            {t.portfolio.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.portfolio.description}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={selectedCategory === index ? "default" : "outline"}
              onClick={() => setSelectedCategory(index)}
              className="transition-all duration-300 hover:scale-105"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map(project => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(language === "id" ? project.status.id : project.status.en)}`}
                    >
                      {language === "id" ? project.status.id : project.status.en}
                    </div>
                  </div>

                  {/* Hover Links */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.url && (
                      <Button size="sm" className="bg-white hover:bg-gray-100 text-gray-800" asChild>
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t.portfolio.liveDemo}
                        </a>
                      </Button>
                    )}
                    {project.github && (
                      <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-white" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          {t.portfolio.code}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <Tag className="h-3 w-3 mr-1" />
                      {language === "id" ? project.category.id : project.category.en}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.year}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {language === "id" ? project.description.id : project.description.en}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                        +{project.technologies.length - 3} {t.common.more}
                      </span>
                    )}
                  </div>

                  <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <Link href={`/portfolio/${project.id}`}>{t.portfolio.viewDetails}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">{t.portfolio.noProjects}</h3>
            <p className="text-gray-600">
              {t.portfolio.noProjectsDesc}
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 py-16 bg-white shadow-lg rounded-3xl border border-gray-100"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{t.home.cta.title}</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t.home.cta.description}
          </p>
          <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4" asChild>
            <Link href="/contact">{t.home.cta.button}</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

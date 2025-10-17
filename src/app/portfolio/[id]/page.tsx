"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Github, Calendar, Tag, ArrowLeft, Lightbulb, Target, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { portfolioProjects, type PortfolioProject } from '@/data/portfolio'
import ImageLightbox from '@/components/portfolio/ImageLightbox'
import { useLanguage } from '@/contexts/LanguageContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

export default function ProjectDetailPage() {
  const { t, language } = useLanguage()
  const params = useParams()
  const projectId = params.id as string

  const project = portfolioProjects.find(p => p.id === projectId) || null
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-yellow-500'
      case 'planned':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{t.portfolio.projectNotFound}</h1>
            <p className="text-gray-600 mb-8">
              {t.portfolio.projectNotFoundDesc}
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" asChild>
              <Link href="/portfolio">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.portfolio.backToPortfolio}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200" asChild>
            <Link href="/portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.projectDetail.backToPortfolio}
            </Link>
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div
            variants={itemVariants}
            className="relative h-96 rounded-3xl overflow-hidden mb-12"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-blue-500 text-white border-0">
                  <Tag className="h-3 w-3 mr-1" />
                  {language === "id" ? project.category.id : project.category.en}
                </Badge>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(language === "id" ? project.status.id : project.status.en)}`}>
                  {language === "id" ? project.status.id : project.status.en}
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {project.title}
              </h1>

              <p className="text-xl text-white/90 max-w-3xl">
                {language === "id" ? project.description.id : project.description.en}
              </p>

              <div className="flex items-center gap-4 mt-6">
                {project.url && (
                  <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-800" asChild>
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      {t.projectDetail.liveDemo}
                    </a>
                  </Button>
                )}
                {project.github && (
                  <Button size="lg" className="bg-gray-800 hover:bg-gray-700 text-white" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5 mr-2" />
                      {t.projectDetail.viewCode}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-12">
              {/* Project Overview */}
              <Card className="p-8 border-0 shadow-lg bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{t.projectDetail.overview}</h2>
                </div>
                <div className="max-w-none">
                  <p className="text-lg leading-relaxed text-gray-600">{language === "id" ? project.description.id : project.description.en}</p>
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">{t.projectDetail.client}</h3>
                    <p className="text-base text-gray-600">{project.client}</p>
                  </div>
                </div>
              </Card>

              {/* Key Features */}
              <Card className="p-8 border-0 shadow-lg bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{t.projectDetail.features}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(language === "id" ? project.features.id : project.features.en).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{feature}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Project Metrics */}
              {project.metrics && Object.keys(project.metrics).length > 0 && (
                <Card className="p-8 border-0 shadow-lg bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{t.projectDetail.metrics}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-500 capitalize mb-1">{key}</p>
                        <p className="text-xl font-semibold text-gray-800">{language === "id" ? value.id : value.en}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Image Gallery */}
              {project.images && project.images.length > 0 && (
                <Card className="p-8 border-0 shadow-lg bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{t.projectDetail.gallery}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="relative aspect-video rounded-lg overflow-hidden group shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Image
                          src={img}
                          alt={`${project.title} - Gambar ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 rounded-full p-3">
                              <Zap className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>

            {/* Image Lightbox */}
            {project.images && (
              <ImageLightbox
                images={project.images}
                initialIndex={selectedImageIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
              />
            )}

            {/* Sidebar */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Project Info */}
              <Card className="p-6 border-0 shadow-lg bg-white">
                <h3 className="text-xl font-bold mb-6 text-gray-800">{t.projectDetail.projectInfo}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.projectDetail.category}</label>
                    <p className="font-semibold text-gray-800">{language === "id" ? project.category.id : project.category.en}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.projectDetail.status}</label>
                    <p className="font-semibold text-gray-800">{language === "id" ? project.status.id : project.status.en}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">{t.projectDetail.year}</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-800">{project.year}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Technologies */}
              <Card className="p-6 border-0 shadow-lg bg-white">
                <h3 className="text-xl font-bold mb-6 text-gray-800">{t.projectDetail.technologies}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Call to Action */}
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                  <div className="p-3 bg-blue-500 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{t.projectDetail.interested}</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {t.projectDetail.interestedDesc}
                  </p>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" asChild>
                    <Link href="/contact">
                      {t.projectDetail.getInTouch}
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Related Projects would go here */}
        </motion.div>
      </div>
    </div>
  )
}
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Play,
  Check,
  Zap,
  Shield,
  Users,
  Globe,
  Target,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ConsultationForm from "@/components/consultation/ConsultationForm";
import TransformBusinessForm from "@/components/contact/TransformBusinessForm";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import { portfolioProjects } from "@/data/portfolio";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomePage() {
  const { t, locale } = useTranslation();
  // Take the first 3 projects as featured projects
  const featuredProjects = portfolioProjects.slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Figmaland Style */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-20 pt-32"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t.home.hero.title}
                </span>
                <span className="text-gray-800 block text-4xl md:text-5xl mt-2">
                  {t.home.hero.subtitle}
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t.home.hero.description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <ConsultationForm>
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg"
                  >
                    {t.home.hero.getStarted}
                  </Button>
                </ConsultationForm>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  {t.home.hero.viewServices}
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="/hero-image.jpg"
                  alt="Ubetanation - IT Solutions and Digital Transformation"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="services"
        className="py-32 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">{t.home.services.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.services.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: t.home.services.softwareDev.title,
                description: t.home.services.softwareDev.description,
              },
              {
                icon: Shield,
                title: t.home.services.cybersecurity.title,
                description: t.home.services.cybersecurity.description,
              },
              {
                icon: Users,
                title: t.home.services.digitalTransformation.title,
                description: t.home.services.digitalTransformation.description,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contents Section */}
      <section
        id="about"
        className="py-32 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {t.home.about.title}
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t.home.about.description}
              </p>
              <div className="space-y-4">
                {t.home.about.points.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4">
                  {t.home.about.cta}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gray-100 rounded-3xl p-8 relative">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20" />
                    <Play className="w-16 h-16 text-blue-500 hover:scale-110 transition-transform cursor-pointer" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section
        id="technologies"
        className="py-32 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t.home.technologies.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.technologies.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {[
              {
                name: "React",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                alt: "React - JavaScript Library for Building User Interfaces"
              },
              {
                name: "Next.js", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
                alt: "Next.js - The React Framework for Production"
              },
              {
                name: "Node.js",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", 
                alt: "Node.js - JavaScript Runtime Environment"
              },
              {
                name: "Express",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
                alt: "Express.js - Fast, Minimalist Web Framework for Node.js"
              },
              {
                name: "TypeScript",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
                alt: "TypeScript - JavaScript with Syntax for Types"
              },
              {
                name: "PostgreSQL", 
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
                alt: "PostgreSQL - Open Source Relational Database"
              },
              {
                name: "MongoDB",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
                alt: "MongoDB - NoSQL Document Database"
              },
              {
                name: "AWS",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
                alt: "Amazon Web Services - Cloud Computing Platform"
              },
              {
                name: "Docker",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
                alt: "Docker - Containerization Platform"
              },
              {
                name: "Kubernetes",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg",
                alt: "Kubernetes - Container Orchestration Platform"
              },
              {
                name: "Python",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
                alt: "Python - High-Level Programming Language"
              },
              {
                name: "Tailwind CSS",
                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", 
                alt: "Tailwind CSS - Utility-First CSS Framework"
              }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center h-24 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  <Image
                    src={tech.logo}
                    alt={tech.alt}
                    width={40}
                    height={40}
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="text-xs font-medium text-gray-600 mt-2 text-center">
                    {tech.name}
                  </span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {tech.alt}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Portfolio Section */}
      <section
        id="portfolio"
        className="py-32 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">{t.home.portfolio.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.portfolio.description}
            </p>
          </motion.div>

          {featuredProjects.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project, index: number) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Link href={`/portfolio/${project.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group bg-white border-0 shadow-lg cursor-pointer">
                        <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium mb-3">{project.client}</p>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                            {locale === "id" ? project.description.id : project.description.en}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies
                              .slice(0, 3)
                              .map((tech: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/portfolio">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4">
                    {t.home.portfolio.viewAll}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="p-12 text-center bg-white shadow-lg">
                <Zap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {t.home.portfolio.comingSoon}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t.home.portfolio.comingSoonDesc}
                </p>
                <Link href="/contact">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    {t.home.portfolio.startProject}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-32 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t.home.contact.title}
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              {t.home.contact.description}
            </p>

            <TransformBusinessForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="font-bold text-2xl text-blue-400">Ubetanation</h3>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer">
                  <Target className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6">{t.footer.services}</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.footer.softwareDev}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.footer.cybersecurity}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.footer.digitalTransformation}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">{t.footer.company}</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    {t.footer.aboutUs}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.footer.portfolio}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.footer.contact}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">{t.footer.contactInfo}</h4>
              <ul className="space-y-3 text-sm">
                <li className="text-gray-400">{t.footer.email}</li>
                <li className="text-gray-400">{t.footer.phone}</li>
                <li className="text-gray-400">{t.footer.address}</li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.footer.getInTouch}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                {t.footer.copyright}
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  {t.footer.privacyPolicy}
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  {t.footer.terms}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

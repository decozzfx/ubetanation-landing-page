"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Heart, 
  Award, 
  TrendingUp, 
  Shield, 
  Lightbulb, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";
import Link from "next/link";

export default function AboutPageClient() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              About Ubetanation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We're a forward-thinking IT solutions company dedicated to transforming businesses 
              through innovative technology, exceptional service, and sustainable digital growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pioneering Digital Excellence Since 2019
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Founded with a vision to bridge the gap between cutting-edge technology and real business needs, 
                  Ubetanation has grown from a small team of passionate developers into a trusted partner for 
                  companies seeking digital transformation.
                </p>
                <p>
                  Our journey began when our founders recognized that many businesses struggled to harness 
                  technology's full potential. We set out to change that by creating solutions that are not 
                  just technically sound, but also strategically aligned with our clients' goals.
                </p>
                <p>
                  Today, we're proud to have helped over 50 businesses across various industries achieve 
                  their digital objectives, from startups looking to establish their online presence to 
                  enterprise companies modernizing their operations.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Users, label: "Team Members", value: "15+" },
                    { icon: Award, label: "Projects Completed", value: "50+" },
                    { icon: Globe, label: "Countries Served", value: "8+" },
                    { icon: Star, label: "Client Satisfaction", value: "98%" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <stat.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission & Vision</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Guiding principles that drive everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To empower businesses with innovative technology solutions that drive growth, 
                    improve efficiency, and create lasting competitive advantages. We're committed 
                    to delivering exceptional value through strategic thinking, technical excellence, 
                    and unwavering dedication to our clients' success.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To be the leading catalyst for digital transformation, where every business 
                    we touch becomes more agile, efficient, and future-ready. We envision a world 
                    where technology seamlessly enables human potential and business growth.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that shape our culture and guide our decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Integrity",
                description: "We conduct business with transparency, honesty, and ethical practices in every interaction.",
                color: "text-blue-600",
                bgColor: "bg-blue-50"
              },
              {
                icon: TrendingUp,
                title: "Excellence",
                description: "We strive for the highest quality in everything we deliver, continuously improving our skills and processes.",
                color: "text-green-600",
                bgColor: "bg-green-50"
              },
              {
                icon: Heart,
                title: "Client-Centric",
                description: "Our clients' success is our success. We listen, understand, and deliver solutions that exceed expectations.",
                color: "text-red-600",
                bgColor: "bg-red-50"
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "We embrace new technologies and creative approaches to solve complex challenges and drive progress.",
                color: "text-purple-600",
                bgColor: "bg-purple-50"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-10 h-10 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our unique approach to technology and business transformation
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {[
                {
                  title: "Business-First Approach",
                  description: "We don't just build technology; we create solutions that directly impact your bottom line and strategic goals."
                },
                {
                  title: "Agile & Adaptive",
                  description: "Our flexible methodologies allow us to pivot quickly and deliver value incrementally throughout the project lifecycle."
                },
                {
                  title: "Long-term Partnership",
                  description: "We're not just vendors; we're strategic partners invested in your ongoing success and growth."
                },
                {
                  title: "Cutting-edge Expertise",
                  description: "Our team stays at the forefront of technology trends, bringing you the latest innovations and best practices."
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="text-2xl font-bold mb-6 text-center">Our Technology Stack</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "React & Next.js", "Node.js & Express", "Python & Django", "Cloud Platforms (AWS/Azure)",
                    "Docker & Kubernetes", "PostgreSQL & MongoDB", "GraphQL & REST APIs", "AI/ML Integration"
                  ].map((tech, index) => (
                    <Badge key={index} variant="secondary" className="justify-center py-2">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Expert Team</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Meet the talented professionals who bring your digital visions to life
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  role: "Senior Developers",
                  count: "8+",
                  description: "Full-stack developers with 5+ years of experience in modern web technologies"
                },
                {
                  role: "DevOps Engineers",
                  count: "3+",
                  description: "Cloud infrastructure specialists ensuring scalable and reliable deployments"
                },
                {
                  role: "UI/UX Designers",
                  count: "4+",
                  description: "Creative professionals focused on user-centered design and exceptional experiences"
                }
              ].map((team, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="text-3xl font-bold text-primary mb-2">{team.count}</div>
                    <h3 className="text-lg font-semibold mb-3">{team.role}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{team.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-lg text-muted-foreground mb-8">
                We're always looking for passionate individuals to join our growing team
              </p>
              <Button size="lg" variant="outline" className="px-8">
                View Career Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how our expertise and values can help drive your digital transformation journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary">
                  View Our Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
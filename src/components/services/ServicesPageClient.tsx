"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Smartphone, 
  Cloud, 
  Database, 
  Shield, 
  Zap,
  Globe,
  Settings,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
  Monitor,
  Server,
  Palette,
  BarChart3,
  Lock,
  Workflow
} from "lucide-react";
import Link from "next/link";
import ConsultationForm from "@/components/consultation/ConsultationForm";

export default function ServicesPageClient() {
  const mainServices = [
    {
      icon: Code,
      title: "Software Development",
      description: "Custom applications built with cutting-edge technologies to solve your unique business challenges.",
      features: [
        "Custom Web Applications",
        "Mobile App Development", 
        "Enterprise Software Solutions",
        "API Development & Integration",
        "Legacy System Modernization",
        "Maintenance & Support"
      ],
      technologies: ["React", "Next.js", "Node.js", "Python", "React Native", "Flutter"],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable, secure, and cost-effective cloud infrastructure designed for modern business needs.",
      features: [
        "Cloud Migration Services",
        "Infrastructure as Code",
        "Auto-scaling Solutions",
        "Cloud Security Implementation",
        "Cost Optimization",
        "24/7 Monitoring & Support"
      ],
      technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform"],
      gradient: "from-green-500 to-teal-500",
      bgGradient: "from-green-50 to-teal-50"
    },
    {
      icon: TrendingUp,
      title: "Digital Transformation",
      description: "Comprehensive digital strategy and implementation to modernize your business processes.",
      features: [
        "Digital Strategy Consulting",
        "Process Automation",
        "System Integration",
        "Data Analytics & BI",
        "Change Management",
        "Training & Adoption"
      ],
      technologies: ["Power BI", "Salesforce", "HubSpot", "Zapier", "Microsoft 365", "Slack"],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    }
  ];

  const additionalServices = [
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your business from digital threats.",
      color: "text-red-600"
    },
    {
      icon: Database,
      title: "Database Management",
      description: "Optimized database design, management, and performance tuning services.",
      color: "text-orange-600"
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "User-centered design that creates exceptional digital experiences.",
      color: "text-indigo-600"
    },
    {
      icon: BarChart3,
      title: "Data Analytics",
      description: "Transform your data into actionable business insights and intelligence.",
      color: "text-emerald-600"
    },
    {
      icon: Settings,
      title: "DevOps & Automation",
      description: "Streamlined development workflows and automated deployment pipelines.",
      color: "text-gray-600"
    },
    {
      icon: Users,
      title: "IT Consulting",
      description: "Strategic technology guidance to align IT investments with business goals.",
      color: "text-purple-600"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Discovery & Strategy",
      description: "We analyze your business needs, challenges, and goals to create a tailored technology roadmap."
    },
    {
      number: "02", 
      title: "Design & Planning",
      description: "Our team designs the optimal solution architecture and creates detailed project plans."
    },
    {
      number: "03",
      title: "Development & Implementation",
      description: "We build and deploy your solution using agile methodologies and best practices."
    },
    {
      number: "04",
      title: "Testing & Optimization",
      description: "Rigorous testing ensures quality, performance, and security before launch."
    },
    {
      number: "05",
      title: "Launch & Support",
      description: "We handle deployment and provide ongoing maintenance and support services."
    }
  ];

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
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Comprehensive IT solutions designed to transform your business, 
              drive innovation, and accelerate growth in the digital age.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core IT Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our flagship services that form the foundation of digital transformation
            </p>
          </motion.div>

          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} flex flex-col lg:flex-row gap-12 items-center`}
              >
                <div className="lg:w-1/2">
                  <Card className={`p-8 bg-gradient-to-br ${service.bgGradient} border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                    <div className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                      <service.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="lg:w-1/2">
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold mb-4">What We Deliver:</h4>
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-lg">{feature}</span>
                      </motion.div>
                    ))}
                    <div className="pt-4">
                      <Link href="/contact">
                        <Button size="lg" className="px-8">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Additional Expertise</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized services to complement your digital transformation journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className={`w-8 h-8 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Proven Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A systematic approach that ensures successful project delivery and client satisfaction
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line for larger screens */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2 -z-10"></div>
            
            <div className="grid lg:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our expertise spans across multiple industries, delivering tailored solutions for diverse business needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Healthcare", icon: "🏥" },
              { name: "Finance", icon: "🏦" },
              { name: "E-commerce", icon: "🛒" },
              { name: "Education", icon: "🎓" },
              { name: "Manufacturing", icon: "🏭" },
              { name: "Real Estate", icon: "🏢" },
              { name: "Logistics", icon: "🚚" },
              { name: "Startups", icon: "🚀" }
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-semibold text-lg">{industry.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Services?</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Proven Track Record",
                    description: "50+ successful projects across diverse industries with 98% client satisfaction rate."
                  },
                  {
                    title: "Expert Team",
                    description: "Certified professionals with deep expertise in modern technologies and best practices."
                  },
                  {
                    title: "Agile Methodology",
                    description: "Flexible, iterative approach ensuring rapid delivery and continuous improvement."
                  },
                  {
                    title: "Ongoing Support",
                    description: "Comprehensive maintenance, monitoring, and support services post-launch."
                  }
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{point.title}</h3>
                      <p className="text-muted-foreground">{point.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-none shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Let's discuss your project requirements and create a customized solution 
                  that drives real business results.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Free initial consultation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Custom project proposal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>No long-term commitments</span>
                  </div>
                </div>
                <div className="pt-6">
                  <Link href="/contact">
                    <Button size="lg" className="w-full">
                      Start Your Project Today
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
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
              Transform Your Business Today
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Don't let outdated technology hold you back. Partner with us to unlock 
              your business potential through innovative IT solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConsultationForm>
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </ConsultationForm>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary">
                  View Our Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
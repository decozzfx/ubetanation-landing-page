"use client"

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  CheckCircle,
  Building,
  Users,
  Globe
} from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function ContactPageClient() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our experts",
      contact: "+62 821-3970-6579",
      action: "Call Now",
      href: "tel:+6282139706579"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Get a response within 24 hours",
      contact: "ubetanbisnis@gmail.com",
      action: "Send Email",
      href: "mailto:ubetanbisnis@gmail.com?subject=Business%20Consultation%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20a%20consultation%20for%20my%20business.%0A%0APlease%20contact%20me%20to%20discuss%20further.%0A%0AThank%20you."
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Chat",
      description: "Chat with us in real-time",
      contact: "Available 9AM-6PM WIB",
      action: "Start Chat",
      href: "https://wa.me/6282139706579?text=Hello%2C%20I%20would%20like%20to%20discuss%20my%20business%20needs%20with%20you."
    }
  ];

  const whyChooseUs = [
    {
      icon: CheckCircle,
      title: "Free Consultation",
      description: "Get expert advice at no cost with detailed project analysis"
    },
    {
      icon: Users,
      title: "Dedicated Team",
      description: "Work with experienced professionals who understand your needs"
    },
    {
      icon: Clock,
      title: "Fast Response",
      description: "We respond to all inquiries within 2 business hours"
    },
    {
      icon: Building,
      title: "Enterprise Ready",
      description: "Scalable solutions built for growing businesses"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving clients worldwide with 24/7 support capabilities"
    },
    {
      icon: Send,
      title: "Agile Process",
      description: "Rapid development with regular updates and transparent communication"
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Let's Build Something Amazing Together
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Ready to transform your business with innovative IT solutions? 
              Get in touch with our experts for a free consultation.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            {contactMethods.map((method, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                      <method.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{method.title}</h3>
                    <p className="text-muted-foreground mb-4">{method.description}</p>
                    <p className="font-medium text-lg mb-4">{method.contact}</p>
                    <a 
                      href={method.href}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                    >
                      {method.action}
                      <Send className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Project Today</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tell us about your project and we'll provide you with a detailed proposal 
              and timeline within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 shadow-lg">
                <ContactForm />
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to delivering exceptional results and building 
              long-term partnerships with our clients.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {whyChooseUs.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions about our services and process.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">How long does a typical project take?</h3>
              <p className="text-muted-foreground">
                Project timelines vary based on complexity. Simple websites take 4-6 weeks, 
                while complex applications can take 12-24 weeks. We provide detailed timelines 
                during our initial consultation.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">What's included in your free consultation?</h3>
              <p className="text-muted-foreground">
                Our free consultation includes project requirement analysis, technology 
                recommendations, rough timeline estimation, and a detailed project proposal. 
                There's no obligation to proceed after the consultation.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Do you provide ongoing support after launch?</h3>
              <p className="text-muted-foreground">
                Yes! We offer various support packages including bug fixes, security updates, 
                performance monitoring, and feature enhancements. We can also provide training 
                for your team to manage the system.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Don't let your competitors get ahead. Contact us today and let's discuss 
              how we can help transform your business with cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Now: (555) 123-4567
              </a>
              <a
                href="mailto:contact@ubetanation.com"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                Send Us an Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
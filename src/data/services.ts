export const services = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Custom web applications built with modern technologies and best practices.",
    icon: "code",
    features: [
      "Responsive Design",
      "Performance Optimization", 
      "SEO-Friendly",
      "Cross-browser Compatibility",
      "Progressive Web Apps",
      "Content Management Systems"
    ],
    technologies: ["React", "Next.js", "Vue.js", "TypeScript", "Node.js", "Express"],
    pricing: {
      starting: 5000,
      range: "5,000 - 50,000",
      timeline: "4-16 weeks"
    },
    portfolio: ["E-commerce Platform", "Corporate Website", "SaaS Dashboard"]
  },
  
  {
    id: "mobile-development", 
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: "smartphone",
    features: [
      "Native iOS & Android",
      "Cross-platform Solutions",
      "App Store Optimization",
      "Push Notifications",
      "Offline Functionality",
      "Third-party Integrations"
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
    pricing: {
      starting: 10000,
      range: "10,000 - 100,000",
      timeline: "8-24 weeks"
    },
    portfolio: ["Fitness Tracking App", "Food Delivery App", "Social Media Platform"]
  },
  
  {
    id: "ecommerce-solutions",
    title: "E-commerce Solutions", 
    description: "Complete online stores with payment processing, inventory management, and more.",
    icon: "shopping-cart",
    features: [
      "Payment Gateway Integration",
      "Inventory Management",
      "Order Processing",
      "Customer Management",
      "Multi-vendor Support",
      "Analytics & Reporting"
    ],
    technologies: ["Shopify", "WooCommerce", "Magento", "Stripe", "PayPal"],
    pricing: {
      starting: 8000,
      range: "8,000 - 75,000", 
      timeline: "6-20 weeks"
    },
    portfolio: ["Fashion Retail Store", "B2B Marketplace", "Subscription Box Service"]
  },
  
  {
    id: "enterprise-software",
    title: "Enterprise Software",
    description: "Scalable enterprise applications and business process automation solutions.",
    icon: "building",
    features: [
      "Custom Business Logic",
      "Database Design & Optimization",
      "User Access Management",
      "API Development",
      "Third-party Integrations",
      "Reporting & Analytics"
    ],
    technologies: ["Java", "Python", "C#", ".NET", "Spring Boot", "Django"],
    pricing: {
      starting: 25000,
      range: "25,000 - 500,000",
      timeline: "12-52 weeks"
    },
    portfolio: ["CRM System", "HR Management Platform", "Inventory Management System"]
  },
  
  {
    id: "cloud-migration",
    title: "Cloud Migration",
    description: "Seamless migration of your applications and data to cloud platforms.",
    icon: "cloud",
    features: [
      "Cloud Strategy & Planning",
      "Application Modernization", 
      "Data Migration",
      "Security Implementation",
      "Cost Optimization",
      "24/7 Monitoring"
    ],
    technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform"],
    pricing: {
      starting: 15000,
      range: "15,000 - 200,000",
      timeline: "8-32 weeks"
    },
    portfolio: ["Legacy System Migration", "Multi-cloud Setup", "Microservices Architecture"]
  },
  
  {
    id: "digital-transformation",
    title: "Digital Transformation",
    description: "Comprehensive digital strategy and technology modernization consulting.",
    icon: "trending-up",
    features: [
      "Technology Assessment",
      "Digital Strategy Planning",
      "Process Automation",
      "Change Management",
      "Training & Support",
      "Performance Monitoring"
    ],
    technologies: ["Various based on needs", "Integration platforms", "Automation tools"],
    pricing: {
      starting: 20000,
      range: "20,000 - 300,000",
      timeline: "12-48 weeks"
    },
    portfolio: ["Manufacturing Digitization", "Healthcare System Modernization", "Financial Services Transformation"]
  }
]

export const serviceCategories = [
  {
    name: "Development",
    services: ["web-development", "mobile-development"]
  },
  {
    name: "E-commerce",
    services: ["ecommerce-solutions"]
  },
  {
    name: "Enterprise",
    services: ["enterprise-software", "digital-transformation"]
  },
  {
    name: "Cloud & Infrastructure", 
    services: ["cloud-migration"]
  }
]
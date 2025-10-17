export interface PortfolioProject {
  id: string;
  title: string;
  description: {
    id: string;
    en: string;
  };
  category: {
    id: string;
    en: string;
  };
  technologies: string[];
  features: {
    id: string[];
    en: string[];
  };
  image: string;
  images?: string[];
  url?: string;
  github?: string;
  appStore?: string;
  playStore?: string;
  client: string;
  year: string;
  status: {
    id: string;
    en: string;
  };
  metrics: {
    [key: string]: {
      id: string;
      en: string;
    };
  };
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "solidarirun-2025",
    title: "Solidarirun 2025",
    description: {
      id: "Website acara lari di Ponorogo 2025. Platform untuk registrasi, informasi, dan manajemen acara untuk solidarity run tahunan.",
      en: "A running event website in Ponorogo 2025. Platform for registration, information, and event management for the annual solidarity run.",
    },
    category: {
      id: "Manajemen Acara",
      en: "Event Management",
    },
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Express", "Posgresql", "Midtrans"],
    features: {
      id: [
        "Sistem registrasi acara",
        "Manajemen peserta",
        "Tampilan informasi acara",
        "Desain responsif mobile",
        "Update real-time",
        "Galeri foto",
      ],
      en: [
        "Event registration system",
        "Participant management",
        "Event information display",
        "Mobile-responsive design",
        "Real-time updates",
        "Photo gallery",
      ],
    },
    image: "/solidarirun2025/1.png",
    images: [
      "/solidarirun2025/1.png",
      "/solidarirun2025/2.png",
      "/solidarirun2025/3.png",
      "/solidarirun2025/4..png",
      "/solidarirun2025/5.png",
    ],
    url: "https://solidarirun.site",
    client: "Solidarirun Event Organizer",
    year: "2025",
    status: {
      id: "Live",
      en: "Live",
    },
    metrics: {
      participants: {
        id: "500+ pelari terdaftar",
        en: "500+ registered runners",
      },
      location: {
        id: "Ponorogo, Indonesia",
        en: "Ponorogo, Indonesia",
      },
      category: {
        id: "Acara Lari Komunitas",
        en: "Community Running Event",
      },
    },
  },

  {
    id: "ecommerce-platform",
    title: "Enterprise E-commerce Platform",
    description: {
      id: "Platform e-commerce lengkap dengan dukungan multi-vendor, analitik canggih, dan integrasi pembayaran yang mulus.",
      en: "A fully-featured e-commerce platform with multi-vendor support, advanced analytics, and seamless payment integration.",
    },
    category: {
      id: "E-commerce",
      en: "E-commerce",
    },
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "AWS"],
    features: {
      id: [
        "Marketplace multi-vendor",
        "Manajemen inventaris real-time",
        "Dashboard analitik canggih",
        "Desain responsif mobile",
        "Pemrosesan pembayaran terintegrasi",
        "Optimasi SEO",
      ],
      en: [
        "Multi-vendor marketplace",
        "Real-time inventory management",
        "Advanced analytics dashboard",
        "Mobile-responsive design",
        "Integrated payment processing",
        "SEO optimization",
      ],
    },
    image: "/portfolio/ecommerce-platform.jpg",
    url: "https://demo.ubetanation.com/ecommerce",
    github: "https://github.com/ubetanation/ecommerce-platform",
    client: "TechRetail Solutions",
    year: "2024",
    status: {
      id: "Live",
      en: "Live",
    },
    metrics: {
      users: {
        id: "50.000+ pengguna aktif",
        en: "50,000+ active users",
      },
      transactions: {
        id: "$2M+ dalam transaksi",
        en: "$2M+ in transactions",
      },
      performance: {
        id: "99.9% uptime",
        en: "99.9% uptime",
      },
    },
  },

  {
    id: "healthcare-management",
    title: "Healthcare Management System",
    description: {
      id: "Platform manajemen kesehatan komprehensif untuk rekam medis pasien, janji temu, dan telemedicine.",
      en: "Comprehensive healthcare management platform for patient records, appointments, and telemedicine.",
    },
    category: {
      id: "Kesehatan",
      en: "Healthcare",
    },
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "AWS"],
    features: {
      id: [
        "Rekam Kesehatan Elektronik (EHR)",
        "Penjadwalan janji temu",
        "Integrasi telemedicine",
        "Manajemen resep",
        "Pemrosesan klaim asuransi",
        "Kepatuhan HIPAA",
      ],
      en: [
        "Electronic Health Records (EHR)",
        "Appointment scheduling",
        "Telemedicine integration",
        "Prescription management",
        "Insurance claims processing",
        "HIPAA compliance",
      ],
    },
    image: "/portfolio/healthcare-system.jpg",
    url: "https://demo.ubetanation.com/healthcare",
    client: "MediCare Plus",
    year: "2023",
    status: {
      id: "Live",
      en: "Live",
    },
    metrics: {
      users: {
        id: "25.000+ pasien",
        en: "25,000+ patients",
      },
      appointments: {
        id: "100.000+ terjadwal",
        en: "100,000+ scheduled",
      },
      satisfaction: {
        id: "98% kepuasan pengguna",
        en: "98% user satisfaction",
      },
    },
  },

  {
    id: "fintech-mobile-app",
    title: "FinTech Mobile Application",
    description: {
      id: "Aplikasi mobile perbankan dan manajemen keuangan modern dengan keamanan canggih dan transaksi real-time.",
      en: "Modern banking and financial management mobile app with advanced security and real-time transactions.",
    },
    category: {
      id: "FinTech",
      en: "FinTech",
    },
    technologies: ["React Native", "Python", "PostgreSQL", "Redis", "Docker"],
    features: {
      id: [
        "Transaksi real-time",
        "Autentikasi biometrik",
        "Pelacakan anggaran",
        "Portofolio investasi",
        "Otomasi pembayaran tagihan",
        "Dukungan multi-mata uang",
      ],
      en: [
        "Real-time transactions",
        "Biometric authentication",
        "Budget tracking",
        "Investment portfolio",
        "Bill payment automation",
        "Multi-currency support",
      ],
    },
    image: "/portfolio/fintech-app.jpg",
    appStore: "https://apps.apple.com/app/fintech-app",
    playStore: "https://play.google.com/store/apps/details?id=com.ubetanation.fintech",
    client: "NeoBank Solutions",
    year: "2024",
    status: {
      id: "Live",
      en: "Live",
    },
    metrics: {
      downloads: {
        id: "100.000+ unduhan",
        en: "100,000+ downloads",
      },
      rating: {
        id: "Rating 4.8/5 bintang",
        en: "4.8/5 star rating",
      },
      transactions: {
        id: "$5M+ diproses",
        en: "$5M+ processed",
      },
    },
  },

  {
    id: "logistics-platform",
    title: "Supply Chain Management Platform",
    description: {
      id: "Sistem manajemen logistik dan supply chain end-to-end dengan pelacakan real-time dan analitik.",
      en: "End-to-end logistics and supply chain management system with real-time tracking and analytics.",
    },
    category: {
      id: "Logistik",
      en: "Logistics",
    },
    technologies: ["Vue.js", "Django", "PostgreSQL", "Redis", "Docker"],
    features: {
      id: [
        "Pelacakan pengiriman real-time",
        "Optimasi inventaris",
        "Perencanaan rute",
        "Manajemen vendor",
        "Dashboard analitik",
        "Aplikasi mobile untuk driver",
      ],
      en: [
        "Real-time shipment tracking",
        "Inventory optimization",
        "Route planning",
        "Vendor management",
        "Analytics dashboard",
        "Mobile app for drivers",
      ],
    },
    image: "/portfolio/logistics-platform.jpg",
    url: "https://demo.ubetanation.com/logistics",
    client: "GlobalShip Logistics",
    year: "2023",
    status: {
      id: "Live",
      en: "Live",
    },
    metrics: {
      shipments: {
        id: "1M+ pengiriman dilacak",
        en: "1M+ shipments tracked",
      },
      efficiency: {
        id: "30% pengurangan biaya",
        en: "30% cost reduction",
      },
      coverage: {
        id: "50+ negara",
        en: "50+ countries",
      },
    },
  },

  {
    id: "saas-dashboard",
    title: "Analytics SaaS Dashboard",
    description: {
      id: "Dashboard business intelligence komprehensif dengan pelaporan kustom dan visualisasi data.",
      en: "Comprehensive business intelligence dashboard with custom reporting and data visualization.",
    },
    category: {
      id: "SaaS",
      en: "SaaS",
    },
    technologies: ["Next.js", "TypeScript", "GraphQL", "PostgreSQL", "D3.js"],
    features: {
      id: [
        "Builder dashboard kustom",
        "Visualisasi data canggih",
        "Analitik real-time",
        "Pembuatan laporan kustom",
        "Integrasi API",
        "Solusi white-label",
      ],
      en: [
        "Custom dashboard builder",
        "Advanced data visualization",
        "Real-time analytics",
        "Custom report generation",
        "API integrations",
        "White-label solution",
      ],
    },
    image: "/portfolio/saas-dashboard.jpg",
    url: "https://demo.ubetanation.com/analytics",
    github: "https://github.com/ubetanation/analytics-dashboard",
    client: "DataInsights Pro",
    year: "2024",
    status: {
      id: "Live",
      en: "Live",
    },
    metrics: {
      customers: {
        id: "500+ bisnis",
        en: "500+ businesses",
      },
      data: {
        id: "10TB+ data diproses",
        en: "10TB+ data processed",
      },
      queries: {
        id: "1M+ query/hari",
        en: "1M+ queries/day",
      },
    },
  },

  {
    id: "education-platform",
    title: "Online Learning Platform",
    description: {
      id: "Platform e-learning modern dengan kursus interaktif, streaming video, dan pelacakan progres.",
      en: "Modern e-learning platform with interactive courses, video streaming, and progress tracking.",
    },
    category: {
      id: "Pendidikan",
      en: "Education",
    },
    technologies: ["React", "Node.js", "MongoDB", "AWS S3", "WebRTC"],
    features: {
      id: [
        "Builder kursus interaktif",
        "Streaming video HD",
        "Ruang kelas virtual live",
        "Pelacakan progres",
        "Sistem sertifikasi",
        "Aplikasi pembelajaran mobile",
      ],
      en: [
        "Interactive course builder",
        "HD video streaming",
        "Live virtual classrooms",
        "Progress tracking",
        "Certification system",
        "Mobile learning app",
      ],
    },
    image: "/portfolio/education-platform.jpg",
    url: "https://demo.ubetanation.com/education",
    client: "EduTech Academy",
    year: "2023",
    status: {
      id: "Live",
      en: "Live",
    },
    metrics: {
      students: {
        id: "75.000+ terdaftar",
        en: "75,000+ enrolled",
      },
      courses: {
        id: "2.000+ kursus",
        en: "2,000+ courses",
      },
      completion: {
        id: "85% tingkat penyelesaian",
        en: "85% completion rate",
      },
    },
  },
];

export const portfolioCategories = {
  id: [
    "Semua",
    "Manajemen Acara",
    "E-commerce",
    "Kesehatan",
    "FinTech",
    "Logistik",
    "SaaS",
    "Pendidikan",
  ],
  en: [
    "All",
    "Event Management",
    "E-commerce",
    "Healthcare",
    "FinTech",
    "Logistics",
    "SaaS",
    "Education",
  ],
};

export const technologies = [
  "React",
  "Next.js",
  "Vue.js",
  "Node.js",
  "TypeScript",
  "Python",
  "Django",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "React Native",
];

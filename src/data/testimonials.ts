export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  project?: string;
  content: {
    id: string;
    en: string;
  };
  rating: number;
  avatar: string;
  featured: boolean;
  order: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "apan-solidarirun",
    name: "Apan",
    role: "Event Promotor",
    project: "Solidarirun 2025",
    content: {
      id: "Bekerja sama dengan Ubetanation untuk membangun website Solidarirun adalah keputusan terbaik. Mereka memahami visi kami sebagai event lari charity dan menghadirkan platform yang modern, mudah digunakan, dan aman untuk registrasi peserta serta integrasi pembayaran. Hasilnya luar biasa!",
      en: "Collaborating with Ubetanation to build the Solidarirun website was the best decision. They understood our vision as a charity running event and delivered a modern, user-friendly, and secure platform for participant registration and payment integration. The results are outstanding!"
    },
    rating: 5,
    avatar: "A",
    featured: true,
    order: 1,
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    role: "CTO",
    company: "TechRetail Solutions",
    project: "Enterprise E-commerce Platform",
    content: {
      id: "Ubetanation mengubah platform e-commerce kami sepenuhnya. Keahlian teknis dan perhatian mereka terhadap detail menghasilkan peningkatan penjualan online sebesar 300%. Tim mereka profesional, responsif, dan memberikan tepat apa yang kami butuhkan.",
      en: "Ubetanation transformed our e-commerce platform completely. Their technical expertise and attention to detail resulted in a 300% increase in our online sales. The team was professional, responsive, and delivered exactly what we needed."
    },
    rating: 5,
    avatar: "SJ",
    featured: true,
    order: 2,
  },
  {
    id: "michael-rodriguez",
    name: "Michael Rodriguez",
    role: "CEO",
    company: "MediCare Plus",
    project: "Healthcare Management System",
    content: {
      id: "Sistem manajemen kesehatan yang mereka bangun untuk kami telah merevolusi cara kami menangani perawatan pasien. Antarmuka pengguna intuitif, dan keandalan sistem sangat luar biasa. Sangat direkomendasikan untuk organisasi kesehatan mana pun.",
      en: "The healthcare management system they built for us has revolutionized how we handle patient care. The user interface is intuitive, and the system's reliability has been outstanding. Highly recommended for any healthcare organization."
    },
    rating: 5,
    avatar: "MR",
    featured: true,
    order: 3,
  },
]

export const testimonialStats = {
  averageRating: 5.0,
  totalProjects: 50,
  clientSatisfaction: 98,
  projectsCompleted: 48,
  repeatClients: 75
}
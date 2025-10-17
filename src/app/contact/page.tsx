import type { Metadata } from "next";
import ContactPageClient from "@/components/contact/ContactPageClient";
import { FAQStructuredData, BreadcrumbStructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Contact Us - Ubetanation | Get Your Free IT Consultation",
  description: "Ready to transform your business with innovative IT solutions? Contact Ubetanation today for a free consultation. We're here to help you achieve your digital goals.",
  keywords: "contact, IT consultation, business transformation, software development, digital solutions",
};

export default function ContactPage() {
  return (
    <>
      <FAQStructuredData
        faqs={[
          {
            question: "How long does a typical project take?",
            answer: "Project timelines vary based on complexity. Simple websites take 4-6 weeks, while complex applications can take 12-24 weeks. We provide detailed timelines during our initial consultation."
          },
          {
            question: "What's included in your free consultation?",
            answer: "Our free consultation includes project requirement analysis, technology recommendations, rough timeline estimation, and a detailed project proposal. There's no obligation to proceed after the consultation."
          },
          {
            question: "Do you provide ongoing support after launch?",
            answer: "Yes! We offer various support packages including bug fixes, security updates, performance monitoring, and feature enhancements. We can also provide training for your team to manage the system."
          }
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://ubetanation.com" },
          { name: "Contact" }
        ]}
      />
      <ContactPageClient />
    </>
  );
}
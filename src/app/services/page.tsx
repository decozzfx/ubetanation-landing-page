import type { Metadata } from "next";
import ServicesPageClient from "@/components/services/ServicesPageClient";
import { ServiceStructuredData, BreadcrumbStructuredData } from "@/components/seo/StructuredData";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata.services();

export default function ServicesPage() {
  return (
    <>
      <ServiceStructuredData
        name="IT Solutions & Services"
        description="Comprehensive IT solutions including software development, cloud solutions, digital transformation, cybersecurity, and technology consulting."
        serviceType="Technology Consulting"
      />
      <ServiceStructuredData
        name="Software Development"
        description="Custom applications built with cutting-edge technologies to solve your unique business challenges."
        serviceType="Software Development"
      />
      <ServiceStructuredData
        name="Cloud Solutions"
        description="Scalable, secure, and cost-effective cloud infrastructure designed for modern business needs."
        serviceType="Cloud Computing"
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://ubetanation.com" },
          { name: "Services" }
        ]}
      />
      <ServicesPageClient />
    </>
  );
}
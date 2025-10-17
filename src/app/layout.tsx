import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { OrganizationStructuredData, WebsiteStructuredData } from "@/components/seo/StructuredData";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { metaDescriptions, pageTitle, seoKeywords } from "@/data/seo-keywords";
import "./globals.css";
import Script from 'next/script';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: pageTitle.home,
    template: "%s | Ubetanation"
  },
  description: metaDescriptions.home,
  keywords: [
    ...seoKeywords.primary,
    ...seoKeywords.secondary,
    ...seoKeywords.technical.slice(0, 10),
    ...seoKeywords.local
  ],
  authors: [{ name: "Ubetanation" }],
  creator: "Ubetanation",
  publisher: "Ubetanation",
  metadataBase: new URL("https://ubetanation.com"),
  alternates: {
    canonical: "https://ubetanation.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ubetanation.com",
    title: pageTitle.home,
    description: metaDescriptions.home,
    siteName: "Ubetanation",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ubetanation - Premier IT Solutions Company"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle.home,
    description: metaDescriptions.home,
    creator: "@ubetanation",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <OrganizationStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
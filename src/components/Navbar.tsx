"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Languages } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();

  const scrollToSection = (id: string) => {
    // If we're not on the home page, navigate to home first
    if (window.location.pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    // Handle blog navigation
    if (id === "blog") {
      router.push("/blog");
      return;
    }

    // Handle portfolio navigation
    if (id === "portfolio") {
      router.push("/portfolio");
      return;
    }

    // Scroll to section on current page
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  const navigationItems = [
    { name: t.nav.services, id: "services" },
    { name: t.nav.technologies, id: "technologies" },
    { name: t.nav.testimonials, id: "testimonials" },
    { name: t.nav.blog, id: "blog" },
    { name: t.nav.portfolio, id: "portfolio" },
    { name: t.nav.contact, id: "contact" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm ${className}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ubetanation
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end mr-4">
            <div className="flex items-baseline">
              {navigationItems.map(item => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Language Switcher & CTA Button */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-300 hover:border-blue-500"
            >
              <Languages className="h-4 w-4" />
              {language.toUpperCase()}
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
            >
              {t.nav.getStarted}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-gray-300 px-2"
            >
              <Languages className="h-4 w-4" />
              {language.toUpperCase()}
            </Button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navigationItems.map(item => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4">
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full"
              >
                {t.nav.getStarted}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
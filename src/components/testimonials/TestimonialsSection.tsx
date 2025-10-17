"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { useLanguage } from "@/contexts/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

export default function TestimonialsSection() {
  const { t, language } = useLanguage();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getAvatarDisplay = (avatar: string, name: string) => {
    // Use avatar as initials
    return (
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
        {avatar}
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="py-32 px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {t.home.testimonials.title}
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="h-full bg-white border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {language === "id" ? testimonial.content.id : testimonial.content.en}
                  </p>
                  <div className="flex items-center gap-4">
                    {getAvatarDisplay(testimonial.avatar, testimonial.name)}
                    <div>
                      <div className="font-semibold text-gray-800">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                        {testimonial.project && ` - ${testimonial.project}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
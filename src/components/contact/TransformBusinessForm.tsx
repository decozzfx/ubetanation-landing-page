"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

const transformBusinessSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Please describe your project or IT needs (minimum 10 characters)"),
});

type TransformBusinessFormData = z.infer<typeof transformBusinessSchema>;

export default function TransformBusinessForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransformBusinessFormData>({
    resolver: zodResolver(transformBusinessSchema),
  });

  const onSubmit = async (data: TransformBusinessFormData) => {
    setIsSubmitting(true);
    
    // Create email content
    const emailSubject = `Business Transformation Consultation Request`;
    const emailBody = `Hello,

I would like to request a free consultation to discuss my business transformation needs.

Contact Information:
• Name: ${data.name}
• Email: ${data.email}
${data.company ? `• Company: ${data.company}` : ''}

Project Description:
${data.message}

Please contact me to discuss how you can help transform my business with innovative IT solutions.

Thank you!

Best regards,
${data.name}`;

    // Encode for URL
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);
    
    // Create Gmail URL
    const gmailUrl = `mailto:ubetanbisnis@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open Gmail
    window.open(gmailUrl, '_blank');
    
    // Reset form
    reset();
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <Card className="bg-white text-gray-800 max-w-md mx-auto">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Get Free Consultation</h3>
            <div className="space-y-4">
              <div>
                <Input
                  {...register("name")}
                  placeholder="Your Name"
                  className={`border-gray-300 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Business Email"
                  className={`border-gray-300 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register("company")}
                  placeholder="Company Name (Optional)"
                  className="border-gray-300"
                />
              </div>

              <div>
                <textarea
                  {...register("message")}
                  placeholder="Tell us about your project or IT needs"
                  className={`w-full px-4 py-3 border rounded-md resize-none h-32 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSubmitting ? (
                  "Opening Gmail..."
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Request Consultation
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                This will open Gmail with your consultation request pre-filled.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
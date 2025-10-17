"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, Mail, User, Phone, MessageSquare, Building2 } from "lucide-react";

const consultationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().optional(),
  message: z.string().min(10, "Please describe your project requirements (minimum 10 characters)"),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface ConsultationFormProps {
  children: React.ReactNode;
}

export default function ConsultationForm({ children }: ConsultationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const projectType = watch("projectType");

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    
    // Create email content
    const emailSubject = `Free Consultation Request - ${data.projectType}`;
    const emailBody = `Hello,

I would like to request a free consultation for my business.

Contact Information:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone}
${data.company ? `• Company: ${data.company}` : ''}

Project Details:
• Project Type: ${data.projectType}
${data.budget ? `• Budget: ${data.budget}` : ''}

Project Description:
${data.message}

Please contact me to discuss this project further.

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
    
    // Reset form and close modal
    reset();
    setIsOpen(false);
    setIsSubmitting(false);
  };

  const projectTypes = [
    "Web Development",
    "Mobile App Development", 
    "E-commerce Solution",
    "Custom Software Development",
    "IT Consulting",
    "Digital Transformation",
    "Cloud Migration",
    "Database Design",
    "API Development",
    "UI/UX Design",
    "Other"
  ];

  const budgetRanges = [
    "Under IDR 5,000,000",
    "IDR 5,000,000 - IDR 10,000,000", 
    "IDR 10,000,000 - IDR 25,000,000",
    "IDR 25,000,000 - IDR 50,000,000",
    "IDR 50,000,000 - IDR 100,000,000",
    "Over IDR 100,000,000",
    "Prefer to discuss"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Get Your Free Consultation
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            Tell us about your project and we'll send you a detailed consultation via email
          </p>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="John Doe"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@company.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="Your Company Name"
                />
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Project Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectType">Project Type *</Label>
                <Select onValueChange={(value) => setValue("projectType", value)}>
                  <SelectTrigger className={errors.projectType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectType && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="budget">Budget Range (Optional)</Label>
                <Select onValueChange={(value) => setValue("budget", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Project Description *
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Please describe your project requirements, goals, timeline, and any specific features you need..."
              rows={4}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg"
          >
            {isSubmitting ? (
              "Opening Gmail..."
            ) : (
              <>
                <Mail className="mr-2 h-5 w-5" />
                Send Consultation Request
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            This will open Gmail with your consultation request pre-filled. 
            You can review and send it from there.
          </p>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
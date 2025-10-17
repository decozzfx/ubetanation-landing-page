"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { analytics } from '@/hooks/useAnalytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  newsletter: z.boolean().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      newsletter: false
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
        // Track successful form submission
        analytics.trackFormSubmission('contact-form', true)
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const projectTypes = [
    'Web Development',
    'Mobile App Development',
    'E-commerce Solution',
    'Enterprise Software',
    'Cloud Migration',
    'Digital Transformation',
    'Consultation',
    'Other'
  ]

  const budgetRanges = [
    'Under $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    'Over $100,000',
    'Not sure yet'
  ]

  const timelineOptions = [
    'ASAP',
    'Within 1 month',
    '1-3 months',
    '3-6 months',
    '6+ months',
    'Just exploring options'
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200">Message Sent Successfully!</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Thank you for your interest. We'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-200">Error Sending Message</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Please try again or email us directly at contact@ubetanation.com
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('name')}
            id="name"
            placeholder="John Smith"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder="john@company.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-2">
            Company Name
          </label>
          <Input
            {...register('company')}
            id="company"
            placeholder="Your Company"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <Input
            {...register('phone')}
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Project Type <span className="text-red-500">*</span>
        </label>
        <Select onValueChange={(value) => setValue('projectType', value)}>
          <SelectTrigger className={errors.projectType ? 'border-red-500' : ''}>
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
          <p className="mt-1 text-sm text-red-500">{errors.projectType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Budget Range
          </label>
          <Select onValueChange={(value) => setValue('budget', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((budget) => (
                <SelectItem key={budget} value={budget}>
                  {budget}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Project Timeline
          </label>
          <Select onValueChange={(value) => setValue('timeline', value)}>
            <SelectTrigger>
              <SelectValue placeholder="When do you need this?" />
            </SelectTrigger>
            <SelectContent>
              {timelineOptions.map((timeline) => (
                <SelectItem key={timeline} value={timeline}>
                  {timeline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Project Details <span className="text-red-500">*</span>
        </label>
        <Textarea
          {...register('message')}
          id="message"
          rows={6}
          placeholder="Tell us about your project goals, requirements, and any specific features you need..."
          className={errors.message ? 'border-red-500' : ''}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
        <p className="mt-1 text-sm text-slate-500">
          The more details you provide, the better we can help you.
        </p>
      </div>

      {/* Newsletter Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          checked={watch('newsletter')}
          onCheckedChange={(checked) => setValue('newsletter', checked as boolean)}
        />
        <label
          htmlFor="newsletter"
          className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
        >
          Subscribe to our newsletter for tech insights and industry updates
        </label>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Message
          </>
        )}
      </Button>

      <p className="text-xs text-slate-500 text-center">
        By submitting this form, you agree to our privacy policy and terms of service.
      </p>
    </form>
  )
}
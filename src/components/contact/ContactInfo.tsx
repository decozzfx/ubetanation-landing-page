"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react'

export default function ContactInfo() {
  const handleCallClick = () => {
    window.open('tel:+6282139706579', '_self')
  }

  const handleEmailClick = () => {
    window.open('mailto:ubetanbisnis@gmail.com?subject=Business%20Consultation%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20a%20consultation%20for%20my%20business.%0A%0APlease%20contact%20me%20to%20discuss%20further.%0A%0AThank%20you.', '_self')
  }

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+62 821-3970-6579',
      description: 'Mon-Fri 9AM-6PM WIB',
      action: handleCallClick,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'ubetanbisnis@gmail.com',
      description: 'We reply within 24 hours',
      action: handleEmailClick,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'Jln Sendang',
      description: 'Madiun, Indonesia',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/ubetanation',
      color: 'hover:text-blue-600'
    },
    {
      icon: Twitter,
      name: 'Twitter',
      url: 'https://twitter.com/ubetanation',
      color: 'hover:text-blue-400'
    },
    {
      icon: Facebook,
      name: 'Facebook',
      url: 'https://facebook.com/ubetanation',
      color: 'hover:text-blue-700'
    }
  ]

  return (
    <>
      {/* Contact Methods */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
        <div className="space-y-4">
          {contactMethods.map((method, index) => (
            <div 
              key={index}
              className={`flex items-start gap-4 p-4 rounded-lg ${method.action ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors' : ''}`}
              onClick={method.action}
            >
              <div className={`p-2 ${method.bgColor} rounded-lg flex-shrink-0`}>
                <method.icon className={`h-5 w-5 ${method.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium">{method.title}</h4>
                <p className="font-semibold text-sm mt-1">{method.value}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Social Media */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Stay connected for the latest updates and insights
        </p>
        <div className="flex gap-3">
          {socialLinks.map((social, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              asChild
              className={`transition-colors ${social.color}`}
            >
              <a 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon className="h-5 w-5" />
              </a>
            </Button>
          ))}
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <MessageCircle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Emergency Support
          </h3>
        </div>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          Having a critical issue with your existing system? Our emergency support team is available 24/7.
        </p>
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={() => window.open('tel:+6282139706579', '_self')}
        >
          <Phone className="mr-2 h-4 w-4" />
          Call Emergency Line
        </Button>
      </Card>
    </>
  )
}
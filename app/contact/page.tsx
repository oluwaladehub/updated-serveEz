'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Headphones,
  Globe,
  CheckCircle,
  ArrowRight,
  Users,
  Shield,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    contact: 'support@projectverify.com',
    action: 'Send Email'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our team',
    contact: '+234 (0) 123 456 7890',
    action: 'Call Now'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with us in real-time',
    contact: 'Available 9 AM - 6 PM WAT',
    action: 'Start Chat'
  },
  {
    icon: Headphones,
    title: '24/7 Emergency',
    description: 'For urgent project issues',
    contact: '+234 (0) 987 654 3210',
    action: 'Emergency Line'
  }
]

const offices = [
  {
    city: 'Lagos',
    address: '123 Victoria Island, Lagos State, Nigeria',
    phone: '+234 (0) 123 456 7890',
    email: 'lagos@projectverify.com',
    hours: 'Mon-Fri: 8 AM - 6 PM WAT'
  },
  {
    city: 'Abuja',
    address: '456 Central Business District, Abuja, FCT, Nigeria',
    phone: '+234 (0) 123 456 7891',
    email: 'abuja@projectverify.com',
    hours: 'Mon-Fri: 8 AM - 6 PM WAT'
  },
  {
    city: 'Port Harcourt',
    address: '789 GRA Phase 2, Port Harcourt, Rivers State, Nigeria',
    phone: '+234 (0) 123 456 7892',
    email: 'portharcourt@projectverify.com',
    hours: 'Mon-Fri: 8 AM - 6 PM WAT'
  }
]

const faqs = [
  {
    question: 'How long does a verification take?',
    answer: 'Standard verifications take 2-4 weeks depending on location and project complexity. Rush services are available for urgent requests.'
  },
  {
    question: 'What areas do you cover in Nigeria?',
    answer: 'We provide services across all 36 states in Nigeria, with offices in Lagos, Abuja, and Port Harcourt for faster response times.'
  },
  {
    question: 'How much does verification cost?',
    answer: 'Pricing starts from $600 for basic verification. Final cost depends on project size, location, and specific requirements.'
  },
  {
    question: 'Can I track the verification process?',
    answer: 'Yes! Our platform provides real-time updates, live photos, and progress tracking throughout the entire verification process.'
  },
  {
    question: 'What if I\'m not satisfied with the service?',
    answer: 'We offer a 100% satisfaction guarantee. If you\'re not completely satisfied, we\'ll re-do the verification at no extra cost.'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    projectType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      projectType: ''
    })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header isLoggedIn={false} />
      
      {/* Updated Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Connect With Us</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Our team is dedicated to supporting your project verification needs. Reach out today!</p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </section>

      {/* Enhanced Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {method.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                      {method.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-800 font-medium mb-4">
                      {method.contact}
                    </p>
                    <Button className="w-full" variant="outline">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Improved Form and Offices with Map */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you within 24 hours. For urgent matters, please call our emergency line.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select project type</option>
                    <option value="construction">Construction</option>
                    <option value="business">Business Setup</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your project and how we can help..."
                  rows={6}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Offices with Interactive Map */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Locations</h2>
            <div className="h-64 bg-gray-200 rounded-lg mb-6">{/* Placeholder for Google Map */}</div>
            <p className="text-gray-600 mb-8">
              Visit us at any of our locations across Nigeria. Our local teams are ready to assist with your project verification needs.
            </p>

            <div className="space-y-6">
              {offices.map((office, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {office.city} Office
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{office.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ as Accordion */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Updated Trust Indicators */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Why Trust ProjectVerify?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Trusted by 10,000+</h3>
              <p className="text-blue-100">
                Diaspora investors across 50+ countries trust us with their projects
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">24-Hour Response</h3>
              <p className="text-blue-100">
                Average response time of less than 24 hours for all inquiries
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nigeria-Wide Coverage</h3>
              <p className="text-blue-100">
                Professional verification services across all 36 states in Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
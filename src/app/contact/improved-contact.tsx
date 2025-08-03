'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { siteConfig } from '@/config/site.config'
import { Button } from '@/components/ui/button'
import { Mail, Github, MessageCircle, Phone, Send, Loader2 } from 'lucide-react'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ImprovedContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const contactMethods = [
    {
      name: 'Email',
      description: 'Send me an email for work inquiries or collaboration',
      href: `mailto:${siteConfig.social.email}`,
      icon: Mail,
      value: siteConfig.social.email,
    },
    {
      name: 'GitHub',
      description: 'Check out my code and projects',
      href: siteConfig.social.github,
      icon: Github,
      value: '@' + siteConfig.social.github?.split('/').pop(),
      external: true,
    },
    {
      name: 'Twitter',
      description: 'Follow me for updates and tech discussions',
      href: siteConfig.social.twitter,
      icon: MessageCircle,
      value: '@' + siteConfig.social.twitter?.split('/').pop(),
      external: true,
    },
  ].filter(method => method.href && method.value !== '@undefined')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setStatusMessage(result.message)
        setFormData({ name: '', email: '', subject: '', message: '' }) // 重置表单
      } else {
        setStatus('error')
        setStatusMessage(result.error || '发送失败，请稍后重试')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('网络错误，请检查连接后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I'd love to hear from you! Whether you have a question, want to collaborate, 
            or just want to say hi, feel free to reach out.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <div key={method.name} className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Icon className="h-6 w-6 text-primary mr-3" />
                  <h3 className="font-semibold text-lg">{method.name}</h3>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">
                  {method.description}
                </p>
                <div className="space-y-2">
                  <p className="font-mono text-sm">{method.value}</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a 
                      href={method.href} 
                      target={method.external ? "_blank" : undefined}
                      rel={method.external ? "noopener noreferrer" : undefined}
                    >
                      {method.name === 'Email' ? 'Send Email' : `Visit ${method.name}`}
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Improved Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-lg border bg-card">
            <h2 className="text-2xl font-bold mb-6 text-center">Send a Message</h2>
            
            {/* Status Messages */}
            {status === 'success' && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 text-center">{statusMessage}</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-300 text-center">{statusMessage}</p>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-vertical disabled:opacity-50"
                  placeholder="Your message..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground text-center mt-4">
              You can also email me directly at{' '}
              <a 
                href={`mailto:${siteConfig.social.email}`}
                className="text-primary hover:underline"
              >
                {siteConfig.social.email}
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 p-6 rounded-lg bg-muted">
          <h3 className="text-lg font-semibold mb-2">Response Time</h3>
          <p className="text-muted-foreground">
            I typically respond to emails within 24-48 hours. Looking forward to connecting with you!
          </p>
        </div>
      </div>
    </div>
  )
}
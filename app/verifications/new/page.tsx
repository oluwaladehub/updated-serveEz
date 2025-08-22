'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  ArrowLeft,
  MapPin,
  Building,
  Camera,
  Clock,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  User,
  Info,
  Loader2,
  FileText
} from 'lucide-react'

interface Project {
  id: string
  user_id: string
  title: string
  description: string
  location: string
  project_type: string
  estimated_value: number
  currency: string
  status: 'pending' | 'active' | 'completed' | 'suspended'
  created_at: string
}

interface TimelineOption {
  value: string
  label: string
  duration: string
  usd_price: number
  ngn_price: number
  description: string
}

const TIMELINE_OPTIONS: TimelineOption[] = [
  {
    value: '2_weeks',
    label: '2 Weeks',
    duration: '14 days',
    usd_price: 600,
    ngn_price: 900000,
    description: 'Quick verification for urgent projects'
  },
  {
    value: '4_weeks',
    label: '4 Weeks',
    duration: '28 days',
    usd_price: 800,
    ngn_price: 1200000,
    description: 'Standard verification timeline'
  },
  {
    value: '2_months',
    label: '2 Months',
    duration: '60 days',
    usd_price: 1000,
    ngn_price: 1500000,
    description: 'Extended verification for complex projects'
  },
  {
    value: 'project_duration',
    label: 'Entire Project Duration',
    duration: 'Full project lifecycle',
    usd_price: 1500,
    ngn_price: 2250000,
    description: 'Complete project monitoring from start to finish'
  }
]

function NewVerificationForm() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedTimeline, setSelectedTimeline] = useState<string>('')
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'NGN'>('NGN')
  const [requestNotes, setRequestNotes] = useState('')

  // Contact information state variables
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [siteAccessInstructions, setSiteAccessInstructions] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTimeRange, setPreferredTimeRange] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [dataLoading, setDataLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const projectId = searchParams.get('project_id')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    const fetchProjects = async () => {
      if (!user) return

      setDataLoading(true)
      setError(null)

      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['pending', 'active'])
          .order('created_at', { ascending: false })

        if (projectsError) throw projectsError

        if (!projectsData || projectsData.length === 0) {
          setError('You need to create at least one project before requesting verification.')
          return
        }

        setProjects(projectsData)

        // Pre-select project if project_id is provided
        if (projectId) {
          const project = projectsData.find(p => p.id === projectId)
          if (project) {
            setSelectedProject(project)
            setSelectedCurrency(project.currency === 'USD' ? 'USD' : 'NGN')
          } else {
            setError('Project not found or you do not have permission to request verification for it.')
          }
        }

      } catch (err: any) {
        console.error('Error fetching projects:', err.message)
        setError(err.message || 'Failed to load projects.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!loading && user) {
      fetchProjects()
    }
  }, [user, loading, router, supabase, projectId])

  const formatCurrency = (amount: number, currency: 'USD' | 'NGN') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    } else {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
  }

  const getSelectedTimelineOption = () => {
    return TIMELINE_OPTIONS.find(option => option.value === selectedTimeline)
  }

  const getTotalCost = () => {
    const timelineOption = getSelectedTimelineOption()
    if (!timelineOption) return 0
    return selectedCurrency === 'USD' ? timelineOption.usd_price : timelineOption.ngn_price
  }

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setSelectedCurrency(project.currency === 'USD' ? 'USD' : 'NGN')
    }
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedProject) {
        toast.error('Please select a project to proceed.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedTimeline) {
        toast.error('Please select a verification timeline to proceed.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev > 1 ? prev - 1 : 1);
  };

  const validateForm = () => {
    if (!selectedProject) {
      toast.error('Please select a project')
      return false
    }
    if (!selectedTimeline) {
      toast.error('Please select a verification timeline')
      setCurrentStep(2)
      return false
    }
    if (!requestNotes.trim() || requestNotes.trim().length < 10) {
      toast.error('Request notes must be at least 10 characters long')
      setCurrentStep(3)
      return false
    }
    if (!contactName.trim()) {
      toast.error('Please provide a contact name')
      setCurrentStep(3)
      return false
    }
    if (!contactPhone.trim()) {
      toast.error('Please provide a contact phone number')
      setCurrentStep(3)
      return false
    }
    if (!contactEmail.trim()) {
      toast.error('Please provide a contact email')
      setCurrentStep(3)
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm() || !user || !selectedProject) return

    setIsSubmitting(true)

    try {
      const timelineOption = getSelectedTimelineOption()
      if (!timelineOption) throw new Error('Invalid timeline selection')

      // Calculate scheduled date based on timeline
      const scheduledDate = new Date()
      switch (selectedTimeline) {
        case '2_weeks':
          scheduledDate.setDate(scheduledDate.getDate() + 14)
          break
        case '4_weeks':
          scheduledDate.setDate(scheduledDate.getDate() + 28)
          break
        case '2_months':
          scheduledDate.setMonth(scheduledDate.getMonth() + 2)
          break
        case 'project_duration':
          scheduledDate.setMonth(scheduledDate.getMonth() + 6) // Default to 6 months for full project
          break
      }

      const verificationData = {
        project_id: selectedProject.id,
        user_id: user.id,
        status: 'pending' as const,
        request_notes: requestNotes.trim(),
        scheduled_date: scheduledDate.toISOString(),
        timeline: selectedTimeline,
        estimated_cost: getTotalCost(),
        currency: selectedCurrency,
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        contact_email: contactEmail.trim(),
        site_access_instructions: siteAccessInstructions.trim(),
        preferred_date: preferredDate ? new Date(preferredDate).toISOString() : null,
        preferred_time_range: preferredTimeRange.trim()
      }

      const { data: verification, error } = await supabase
        .from('verification_requests')
        .insert([verificationData])
        .select()
        .single()

      if (error) throw error

      // Create notification
      await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          title: 'Verification Request Submitted',
          message: `Your verification request for "${selectedProject.title}" has been submitted and is pending review.`,
          type: 'info',
          related_id: verification.id,
          related_type: 'verification_request'
        }])

      toast.success('Verification request submitted successfully!')
      router.push(`/verifications/${verification.id}`)

    } catch (error: any) {
      console.error('Error submitting verification request:', error)
      toast.error(error.message || 'Failed to submit verification request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Unable to Create Verification Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              {error.includes('create at least one project') ? (
                <Link href="/projects/new" className="flex-1">
                  <Button className="w-full">
                    Create Your First Project
                  </Button>
                </Link>
              ) : (
                <Button onClick={() => window.location.reload()} className="flex-1">
                  Try Again
                </Button>
              )}
              <Link href="/projects">
                <Button variant="outline" className="flex-1">
                  Back to Projects
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/verifications">
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Verifications</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6 sm:h-8 hidden sm:block" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  Request Verification
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  Get professional verification for your project
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                <span className="ml-2 font-medium hidden sm:inline">Select Project</span>
              </div>
              <div className={`flex-1 h-px mx-4 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                <span className="ml-2 font-medium hidden sm:inline">Choose Plan</span>
              </div>
              <div className={`flex-1 h-px mx-4 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
                <span className="ml-2 font-medium hidden sm:inline">Details & Submit</span>
              </div>
            </div>
          </div>

          {/* Step 1: Project Selection */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Step 1: Select Project
                </CardTitle>
                <CardDescription>Choose the project you want to get verified.</CardDescription>
              </CardHeader>
              <CardContent>
                {!projectId ? (
                  <div className="space-y-4">
                    <Select value={selectedProject?.id || ''} onValueChange={handleProjectSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a project to verify" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <span>{project.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {project.status}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                {/* Selected Project Details */}
                {selectedProject && (
                  <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200 truncate">
                          {selectedProject.title}
                        </h3>
                        <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          {selectedProject.status}
                        </Badge>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-200">
                          Estimated Value
                        </p>
                        <p className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300">
                          {formatCurrency(selectedProject.estimated_value, selectedProject.currency as 'USD' | 'NGN')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{selectedProject.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{selectedProject.project_type?.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-3 line-clamp-2">
                      {selectedProject.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Timeline & Pricing */}
          {currentStep === 2 && selectedProject && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Step 2: Verification Timeline & Pricing
                </CardTitle>
                <CardDescription>Select the duration and see the cost for the verification.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Currency Selection */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <span className="text-sm font-medium">Currency:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedCurrency === 'NGN' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCurrency('NGN')}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        NGN (₦)
                      </Button>
                      <Button
                        variant={selectedCurrency === 'USD' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCurrency('USD')}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        USD ($)
                      </Button>
                    </div>
                  </div>

                  {/* Timeline Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {TIMELINE_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${selectedTimeline === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 ring-2 ring-blue-500'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        onClick={() => setSelectedTimeline(option.value)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                            {option.label}
                          </h4>
                          <div className="text-left sm:text-right">
                            <p className="text-base sm:text-lg font-bold text-green-600">
                              {formatCurrency(
                                selectedCurrency === 'USD' ? option.usd_price : option.ngn_price,
                                selectedCurrency
                              )}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
                          Duration: {option.duration}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Details and Contact */}
          {currentStep === 3 && selectedProject && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Step 3: Verification Details
                  </CardTitle>
                  <CardDescription>Provide additional details for the verification team.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="request-notes">Verification Request Notes</Label>
                      <Textarea
                        id="request-notes"
                        value={requestNotes}
                        onChange={(e) => setRequestNotes(e.target.value)}
                        placeholder="Provide any specific instructions, concerns, or areas of focus for the verification team. (e.g., 'Focus on the foundation and structural integrity.')"
                        rows={4}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 10 characters.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    On-Site Contact Information
                  </CardTitle>
                  <CardDescription>Who should our team contact for site access?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Contact Name</Label>
                      <Input id="contact-name" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g., John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input id="contact-phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+234 800 000 0000" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input id="contact-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="johndoe@example.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Scheduling Preferences (Optional)
                  </CardTitle>
                  <CardDescription>Let us know if you have a preferred date and time for the first site visit.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferred-date">Preferred Date</Label>
                      <Input id="preferred-date" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferred-time">Preferred Time Range</Label>
                      <Input id="preferred-time" value={preferredTimeRange} onChange={(e) => setPreferredTimeRange(e.target.value)} placeholder="e.g., 10:00 AM - 1:00 PM" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="site-access">Site Access Instructions</Label>
                      <Textarea
                        id="site-access"
                        value={siteAccessInstructions}
                        onChange={(e) => setSiteAccessInstructions(e.target.value)}
                        placeholder="e.g., 'Call John Doe upon arrival. Site is open from 9 AM to 5 PM on weekdays.'"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          {selectedProject && (
            <div className="mt-8 flex justify-between items-center">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Review and Submit
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Your Verification Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to submit a verification request. Please review the details below before confirming.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="text-sm space-y-4 my-4">
                      <div>
                        <h4 className="font-semibold">Project</h4>
                        <p>{selectedProject?.title}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Verification Plan</h4>
                        <p>{getSelectedTimelineOption()?.label}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Estimated Cost</h4>
                        <p className="font-bold text-lg text-green-600">{formatCurrency(getTotalCost(), selectedCurrency)}</p>
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVerificationForm />
    </Suspense>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  MapPin,
  Building,
  Camera,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  FileText
} from 'lucide-react'

interface VerificationRequest {
  id: string
  project_id: string
  user_id: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  request_notes: string
  admin_notes: string
  scheduled_date: string
  completed_date: string
  assigned_to: string
  timeline: string
  estimated_cost: number
  currency: string
  contact_name: string
  contact_phone: string
  contact_email: string
  site_access_instructions: string
  preferred_date: string
  preferred_time_range: string
  created_at: string
  updated_at: string
  verification_media: VerificationMedia[]
  project: Project
}

interface VerificationMedia {
  id: string
  verification_request_id: string
  file_path: string
  file_name: string
  file_type: 'image' | 'video' | 'audio'
  file_size: number
  caption: string
  metadata: any
  visibility: 'visible' | 'hidden' | 'featured'
  uploaded_by_admin: boolean
  created_at: string
}

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
  timeline: string
  beneficiaries: string
  goals: string
  created_at: string
  updated_at: string
}

export function VerificationDetailContent({ id }: { id: string }) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [verification, setVerification] = useState<VerificationRequest | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    const fetchVerificationData = async () => {
      if (!user) return

      setDataLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from('verification_requests')
          .select(`
            *,
            verification_media (*),
            project:projects (*)
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setVerification(data)
      } catch (err: any) {
        console.error('Error fetching verification:', err.message)
        setError(err.message || 'Failed to load verification details.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchVerificationData()
    }
  }, [authLoading, user, router, supabase, id])

  const formatCurrency = (amount: number, currency: string) => {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getTimelineLabel = (timeline: string) => {
    switch (timeline) {
      case '2_weeks': return '2 Weeks'
      case '4_weeks': return '4 Weeks'
      case '2_months': return '2 Months'
      case 'project_duration': return 'Entire Project Duration'
      default: return timeline
    }
  }

  const getTimeRangeLabel = (timeRange: string) => {
    switch (timeRange) {
      case 'morning': return 'Morning (8:00 AM - 12:00 PM)'
      case 'afternoon': return 'Afternoon (12:00 PM - 4:00 PM)'
      case 'evening': return 'Evening (4:00 PM - 8:00 PM)'
      case 'any': return 'Any time'
      default: return timeRange
    }
  }

  if (authLoading || dataLoading) {
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
              Error Loading Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()} className="flex-1">
                Try Again
              </Button>
              <Link href="/verifications">
                <Button variant="outline" className="flex-1">
                  Back to Verifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!verification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="h-5 w-5" />
              Verification Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The verification request you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/verifications">
              <Button className="w-full">
                Back to Verifications
              </Button>
            </Link>
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
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
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
                    Verification Request
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    Submitted on {formatDate(verification.created_at)}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                <Badge className={`${getStatusColor(verification.status)} px-2 py-1 text-xs sm:text-sm`}>
                  {getStatusIcon(verification.status)}
                  <span className="ml-1 capitalize hidden sm:inline">{verification.status.replace('_', ' ')}</span>
                  <span className="ml-1 capitalize sm:hidden">{verification.status.charAt(0).toUpperCase()}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link href={`/projects/${verification.project?.id || ''}`}>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-200 hover:underline">
                        {verification.project?.title || 'Unknown Project'}
                      </h3>
                    </Link>
                    <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200">
                      {verification.project?.status || 'unknown'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Estimated Value
                    </p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {formatCurrency(verification.project?.estimated_value || 0, verification.project?.currency || 'NGN')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <MapPin className="h-4 w-4" />
                    {verification.project?.location || 'Unknown location'}
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Building className="h-4 w-4" />
                    {verification.project?.project_type?.replace('_', ' ') || 'Unknown type'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Verification Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</h3>
                  <p className="mt-1 text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {getTimelineLabel(verification.timeline)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cost</h3>
                  <p className="mt-1 text-sm sm:text-base font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(verification.estimated_cost, verification.currency)}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Request Notes</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {verification.request_notes}
                </p>
              </div>

              {verification.admin_notes && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">Admin Notes</h3>
                  <p className="mt-2 text-blue-700 dark:text-blue-300 whitespace-pre-line">
                    {verification.admin_notes}
                  </p>
                </div>
              )}

              {verification.site_access_instructions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Site Access Instructions</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {verification.site_access_instructions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{verification.contact_name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{verification.contact_phone}</span>
                </div>
                <div className="flex flex-col sm:col-span-2 lg:col-span-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{verification.contact_email}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Date</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {verification.preferred_date ? formatDate(verification.preferred_date) : 'Not specified'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Time</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {verification.preferred_time_range ? getTimeRangeLabel(verification.preferred_time_range) : 'Not specified'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled Date</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {verification.scheduled_date ? formatDate(verification.scheduled_date) : 'Not yet scheduled'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Date</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {verification.completed_date ? formatDate(verification.completed_date) : 'Not yet completed'}
                  </span>
                </div>
              </div>

              {verification.status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <p className="text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Your verification request is pending review. We'll contact you within 24 hours.
                  </p>
                </div>
              )}

              {verification.status === 'in_progress' && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5" />
                    Your verification is in progress. Our team is working on it.
                  </p>
                  <Link href={`/verifications/${verification.id}/gallery`}>
                    <Button variant="outline" className="w-full border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20">
                      <Camera className="h-4 w-4 mr-2" />
                      View Media Gallery
                    </Button>
                  </Link>
                </div>
              )}

              {verification.status === 'completed' && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-700">
                  <p className="text-green-800 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Your verification has been completed. Check the gallery for verification media.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Verification Media
                {verification.verification_media && verification.verification_media.length > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white">{verification.verification_media.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verification.verification_media && verification.verification_media.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {verification.verification_media.slice(0, 4).map((media) => (
                      <div key={media.id} className="aspect-square relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                        {media.file_type === 'image' && (
                          <img
                            src={media.file_path}
                            alt={media.caption || 'Verification media'}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {media.file_type === 'video' && (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <video
                              src={media.file_path}
                              controls
                              className="max-w-full max-h-full"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href={`/verifications/${verification.id}/gallery`}>
                      <Button className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        View Full Gallery
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Camera className="h-12 w-12 text-gray-300 mb-3" />
                  {verification.status === 'pending' && (
                    <>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Verification Pending</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
                        Media will be available once your verification request is in progress.
                      </p>
                    </>
                  )}

                  {verification.status === 'in_progress' && (
                    <>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">We're Working On It</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
                        Our verification team is working on your request. Media will be uploaded soon.
                      </p>
                      <Link href={`/verifications/${verification.id}/gallery`}>
                        <Button variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Check Gallery
                        </Button>
                      </Link>
                    </>
                  )}

                  {verification.status === 'completed' && (
                    <>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Media Available</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
                        The verification has been completed but no media was uploaded.
                      </p>
                    </>
                  )}

                  {verification.status === 'cancelled' && (
                    <>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Verification Cancelled</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        This verification request has been cancelled.
                      </p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
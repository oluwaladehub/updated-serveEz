'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  Camera,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  BarChart,
  Activity,
  History
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
  timeline: string;
  beneficiaries: string;
  goals: string;
  created_at: string
  updated_at: string
}

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
  created_at: string
  updated_at: string
  verification_media: VerificationMedia[]
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

interface Profile {
  id: string
  email: string
  full_name: string
  phone: string
  country: string
}

export function ProjectDetailContent({ id }: { id: string }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [project, setProject] = useState<Project | null>(null)
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    const fetchProjectData = async () => {
      if (!user) return

      setDataLoading(true)
      setError(null)

      try {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*, timeline, beneficiaries, goals')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (projectError) throw projectError
        setProject(projectData)

        const { data: verificationsData, error: verificationsError } = await supabase
          .from('verification_requests')
          .select(`
            *,
            verification_media (*)
          `)
          .eq('project_id', id)
          .order('created_at', { ascending: false })

        if (verificationsError) throw verificationsError
        setVerificationRequests(verificationsData || [])

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

      } catch (err: any) {
        console.error('Error fetching project:', err.message)
        setError(err.message || 'Failed to load project details.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!loading && user) {
      fetchProjectData()
    }
  }, [user, loading, router, supabase, id])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
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
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'cancelled':
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'active':
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const hasActiveVerificationRequest = verificationRequests.some(
    (request) =>
      request.status === 'pending' ||
      request.status === 'in_progress' ||
      request.status === 'completed'
  );

  const calculateProgress = () => {
    if (!verificationRequests.length) return 0;
    const completed = verificationRequests.filter(r => r.status === 'completed').length;
    return Math.round((completed / verificationRequests.length) * 100);
  };

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
              Error Loading Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()} className="flex-1">
                Try Again
              </Button>
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="h-5 w-5" />
              Project Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The project you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/projects">
              <Button className="w-full">
                Back to Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <Link href="/projects">
                  <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to Projects</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
                <Separator orientation="vertical" className="h-6 sm:h-8 hidden sm:block" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {project?.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    Created {formatDate(project?.created_at || '')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Badge className={`${getStatusColor(project?.status || '')} border px-2 py-1 text-xs sm:text-sm`}>
                  {getStatusIcon(project?.status || '')}
                  <span className="ml-1 capitalize hidden sm:inline">{project?.status?.replace('_', ' ')}</span>
                  <span className="ml-1 capitalize sm:hidden">{project?.status?.charAt(0).toUpperCase()}</span>
                </Badge>
                <Link href={`/projects/${project?.id}/edit`}>
                  <Button variant="outline" size="sm" disabled={hasActiveVerificationRequest} className="px-2 sm:px-3">
                    <Edit className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Edit Project</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex-1">
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {calculateProgress()}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start mb-6 grid grid-cols-3 sm:flex">
                <TabsTrigger value="details" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Details</span>
                  <span className="sm:hidden">Info</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <History className="h-3 w-3 sm:h-4 sm:w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="verifications" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Verifications</span>
                  <span className="sm:hidden">Verify</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Project Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {project?.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Goals</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {project?.goals}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Beneficiaries</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {project?.beneficiaries}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mb-2" />
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Location</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{project?.location}</p>
                      </div>
                      
                      <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="inline-block h-4 w-4 sm:h-5 sm:w-5 text-green-500 mb-2 font-bold">₦</span>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Value</p>
                        <p className="text-xs sm:text-sm font-semibold text-green-600 truncate">
                          {formatCurrency(project?.estimated_value || 0)}
                        </p>
                      </div>
                      
                      <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Building className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 mb-2" />
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Type</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 capitalize truncate">
                          {project?.project_type?.replace('_', ' ')}
                        </p>
                      </div>
                      
                      <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mb-2" />
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Updated</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                          {formatDate(project?.updated_at || '')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Project Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {project?.timeline}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verifications">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Verification Requests ({verificationRequests.length})
                      </CardTitle>
                      <Link href={`/verifications/new?project_id=${id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Camera className="h-4 w-4 mr-1" />
                          Request Verification
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {verificationRequests.length > 0 ? (
                      <div className="space-y-4">
                        {verificationRequests.map((request) => (
                          <div key={request.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                              <Badge className={`${getStatusColor(request.status)} border`}>
                                {getStatusIcon(request.status)}
                                <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatDate(request.created_at)}
                              </span>
                            </div>
                            
                            {request.request_notes && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                {request.request_notes}
                              </p>
                            )}
                            
                            {request.admin_notes && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-700 mb-3">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                                  Admin Notes:
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                  {request.admin_notes}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {request.scheduled_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(request.scheduled_date)}
                                  </span>
                                )}
                                {request.completed_date && (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    {formatDate(request.completed_date)}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Link href={`/verifications/${request.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Details
                                  </Button>
                                </Link>
                                {request.verification_media && request.verification_media.length > 0 && (
                                  <Link href={`/verifications/${request.id}/gallery`}>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                      <Camera className="h-4 w-4 mr-1" />
                                      View Gallery ({request.verification_media.length})
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No Verification Requests Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md mx-auto">
                          Request verification to get visual proof of your project's progress and maintain transparency.
                        </p>
                        <Link href={`/verifications/new?project_id=${id}`}>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Camera className="h-4 w-4 mr-2" />
                            Request First Verification
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Project Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 capitalize">
                      {project?.status?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <Camera className="h-5 w-5 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Verifications</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {verificationRequests.length}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Completed Verifications</span>
                    <span className="font-semibold text-green-600">
                      {verificationRequests.filter(r => r.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Pending Verifications</span>
                    <span className="font-semibold text-yellow-600">
                      {verificationRequests.filter(r => r.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Media Files</span>
                    <span className="font-semibold text-blue-600">
                      {verificationRequests.reduce((acc, r) => acc + (r.verification_media?.length || 0), 0)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Project Value</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(project?.estimated_value || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common project operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/verifications/new?project_id=${id}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="h-4 w-4 mr-2" />
                    Request Verification
                  </Button>
                </Link>
                <Link href={`/projects/${id}/edit`} className="block">
                  <Button variant="outline" className="w-full justify-start" disabled={hasActiveVerificationRequest}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </Button>
                </Link>
                <Link href="/reports" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
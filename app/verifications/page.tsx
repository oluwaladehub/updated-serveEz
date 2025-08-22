'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { Database } from '@/lib/database.types'

import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Camera,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  FileText,
  Eye,
  Download,
  Play,
  Image as ImageIcon,
  Video,
  Mic,
  ExternalLink
} from 'lucide-react'

type Profile = Database['public']['Tables']['profiles']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Notification = Database['public']['Tables']['notifications']['Row']
type VerificationRequest = Database['public']['Tables']['verification_requests']['Row']
type VerificationMedia = Database['public']['Tables']['verification_media']['Row']

interface VerificationWithDetails extends VerificationRequest {
  project: Project
  verification_media: VerificationMedia[]
}

export default function VerificationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [verifications, setVerifications] = useState<VerificationWithDetails[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      if (!user) return

      setDataLoading(true)
      setError(null)

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        // Fetch verification requests with project and media details
        const { data: verificationsData, error: verificationsError } = await supabase
          .from('verification_requests')
          .select(`
            *,
            project:projects(*),
            verification_media(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (verificationsError) throw verificationsError
        setVerifications(verificationsData || [])

        // Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('read', false)
          .order('created_at', { ascending: false })
          .limit(5)

        if (notificationsError) throw notificationsError
        setNotifications(notificationsData || [])

      } catch (err: any) {
        console.error('Error fetching verifications:', err.message)
        setError(err.message || 'Failed to load verifications.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!loading && user) {
      fetchData()
    }
  }, [user, loading, router, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in_progress': return <Camera className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getMediaIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Mic className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return time.toLocaleDateString()
  }

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = verification.project?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.project?.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = selectedTab === 'all' || verification.status === selectedTab

    return matchesSearch && matchesTab
  })

  const getVerificationStats = () => {
    return {
      total: verifications.length,
      pending: verifications.filter(v => v.status === 'pending').length,
      in_progress: verifications.filter(v => v.status === 'in_progress').length,
      completed: verifications.filter(v => v.status === 'completed').length,
      cancelled: verifications.filter(v => v.status === 'cancelled').length,
      totalMedia: verifications.reduce((acc, v) => acc + (v.verification_media?.length || 0), 0)
    }
  }

  const stats = getVerificationStats()

  if (loading || dataLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Loading verifications...</p>
            <p className="text-sm text-gray-600">Fetching verification requests and media</p>
          </div>
        </div>
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
              Error Loading Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        profile={profile}
        notifications={notifications}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">Verifications</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 truncate">
              Track verification requests and view proof media
            </p>
          </div>
          <Link href="/projects" className="flex-shrink-0">
            <Button variant="outline" className="px-3 sm:px-4">
              <Camera className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Request New Verification</span>
              <span className="sm:hidden ml-1">Request</span>
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.in_progress}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <span className="hidden sm:inline">In Progress</span>
                <span className="sm:hidden">Progress</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.cancelled}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Cancelled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalMedia}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <span className="hidden sm:inline">Media Files</span>
                <span className="sm:hidden">Media</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Verification Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-2 sm:py-3">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">Pending</span>
              <span className="sm:hidden">Pend</span>
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">In Progress</span>
              <span className="sm:hidden">Prog</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">Cancelled</span>
              <span className="sm:hidden">Cancel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-6">
            {filteredVerifications.length > 0 ? (
              <div className="space-y-6">
                {filteredVerifications.map((verification) => (
                  <Card key={verification.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(verification.status)}`}>
                            {getStatusIcon(verification.status)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {verification.project?.title}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{verification.project?.location}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                {getTimeAgo(verification.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(verification.status)} text-xs flex-shrink-0`}>
                          <span className="hidden sm:inline">{verification.status.replace('_', ' ')}</span>
                          <span className="sm:hidden">{verification.status.charAt(0).toUpperCase()}</span>
                        </Badge>
                      </div>

                      {verification.request_notes && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            <strong>Request Notes:</strong> {verification.request_notes}
                          </p>
                        </div>
                      )}

                      {verification.admin_notes && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                            <strong>Admin Notes:</strong> {verification.admin_notes}
                          </p>
                        </div>
                      )}

                      {verification.scheduled_date && (
                        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                            <strong>Scheduled Date:</strong> {new Date(verification.scheduled_date).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {verification.verification_media && verification.verification_media.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Verification Media ({verification.verification_media.length} files)
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {verification.verification_media.map((media) => (
                              <div key={media.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  {getMediaIcon(media.file_type)}
                                  <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                    {media.file_name}
                                  </span>
                                </div>
                                {media.caption && (
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                    {media.caption}
                                  </p>
                                )}
                                <div className="flex gap-1">
                                  <Button size="sm" variant="outline" className="flex-1 text-xs px-2">
                                    <Eye className="h-3 w-3 sm:mr-1" />
                                    <span className="hidden sm:inline">View</span>
                                  </Button>
                                  <Button size="sm" variant="outline" className="px-2">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          {verification.completed_date ? (
                            <span>Completed on {new Date(verification.completed_date).toLocaleDateString()}</span>
                          ) : (
                            <span>Created {getTimeAgo(verification.created_at)}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/verifications/${verification.id}`} className="flex-1 sm:flex-none">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                              <span className="hidden sm:inline">View Details</span>
                              <span className="sm:hidden ml-1">Details</span>
                            </Button>
                          </Link>
                          {verification.verification_media && verification.verification_media.length > 0 && (
                            <Link href={`/verifications/${verification.id}/gallery`} className="flex-1 sm:flex-none">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-xs sm:text-sm">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                <span className="hidden sm:inline">View Gallery</span>
                                <span className="sm:hidden ml-1">Gallery</span>
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {verifications.length === 0 ? 'No verifications yet' : 'No verifications match your filter'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {verifications.length === 0
                      ? 'Request your first verification to get visual proof of your project progress.'
                      : 'Try selecting a different status filter to see more verifications.'
                    }
                  </p>
                  {verifications.length === 0 && (
                    <Link href="/projects">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Camera className="h-4 w-4 mr-2" />
                        Request First Verification
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
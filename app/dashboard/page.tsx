'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { Database } from '@/lib/database.types'

import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCards from '@/components/dashboard/StatsCards'
import ProjectCard from '@/components/dashboard/ProjectCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  PlusCircle, 
  Bell, 
  Info, 
  Eye, 
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Target,
  Zap,
  BarChart3,
  FolderDot
} from 'lucide-react'

type Profile = Database['public']['Tables']['profiles']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Notification = Database['public']['Tables']['notifications']['Row']
type VerificationRequest = Database['public']['Tables']['verification_requests']['Row']
type VerificationMedia = Database['public']['Tables']['verification_media']['Row']

interface ProjectWithDetails extends Project {
  verification_requests: (VerificationRequest & {
    verification_media: VerificationMedia[]
  })[]
}

interface DashboardStats {
  totalProjects: number
  totalInvestment: number
  activeVerifications: number
  completedVerifications: number
  pendingVerifications: number
  totalMediaFiles: number
  averageProgress: number
  monthlyGrowth: number
}

interface ActivityItem {
  id: string
  type: 'verification_completed' | 'project_created' | 'verification_started' | 'media_uploaded' | 'project_updated'
  title: string
  description: string
  project_name: string
  timestamp: string
  status?: string
  media_count?: number
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<ProjectWithDetails[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalInvestment: 0,
    activeVerifications: 0,
    completedVerifications: 0,
    pendingVerifications: 0,
    totalMediaFiles: 0,
    averageProgress: 0,
    monthlyGrowth: 0
  })
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    async function fetchDashboardData() {
      if (!user) return

      setDataLoading(true)
      setError(null)
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            verification_requests (
              *,
              verification_media (*)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (projectsError) throw projectsError
        setProjects(projectsData || [])

        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (notificationsError) throw notificationsError
        setNotifications(notificationsData || [])

        const totalProjects = projectsData?.length || 0
        const totalInvestment = projectsData?.reduce((acc, project) => 
          acc + (Number(project.estimated_value) || 0), 0) || 0
        
        const allRequests = projectsData?.flatMap(p => p.verification_requests || []) || []
        const activeVerifications = allRequests.filter(req => req.status === 'in_progress').length
        const completedVerifications = allRequests.filter(req => req.status === 'completed').length
        const pendingVerifications = allRequests.filter(req => req.status === 'pending').length
        
        const totalMediaFiles = allRequests.reduce((acc, req) => 
          acc + (req.verification_media?.length || 0), 0)
        
        const averageProgress = totalProjects > 0 
          ? Math.round(projectsData.reduce((acc, project) => {
              const requests = project.verification_requests || []
              const progress = requests.length > 0 
                ? (requests.filter((req: any) => req.status === 'completed').length / requests.length) * 100
                : 0
              return acc + progress
            }, 0) / totalProjects)
          : 0

        const monthlyGrowth = 12.5

        setStats({
          totalProjects,
          totalInvestment,
          activeVerifications,
          completedVerifications,
          pendingVerifications,
          totalMediaFiles,
          averageProgress,
          monthlyGrowth
        })

        const activities: ActivityItem[] = []
        
        projectsData?.forEach(project => {
          activities.push({
            id: `project-${project.id}`,
            type: 'project_created',
            title: `Project "${project.title}" created`,
            description: `New ${project.project_type} project in ${project.location}`,
            project_name: project.title,
            timestamp: project.created_at
          });
          
          project.verification_requests?.forEach((req: any) => {
            // Submitted (pending)
            activities.push({
              id: `verification-submitted-${req.id}`,
              type: 'verification_started',
              title: `Verification submitted for "${project.title}"`,
              description: `Verification request created for ${project.title}`,
              project_name: project.title,
              timestamp: req.created_at,
              status: 'pending',
              media_count: req.verification_media?.length || 0
            });
          
            // In progress
            if (req.status === 'in_progress') {
              activities.push({
                id: `verification-inprogress-${req.id}`,
                type: 'verification_started',
                title: `Verification in progress for "${project.title}"`,
                description: `Verification moved to in progress for ${project.title}`,
                project_name: project.title,
                timestamp: req.updated_at || req.created_at,
                status: req.status,
                media_count: req.verification_media?.length || 0
              });
            }
          
            // Completed
            if (req.status === 'completed') {
              activities.push({
                id: `verification-completed-${req.id}`,
                type: 'verification_completed',
                title: `Verification completed for "${project.title}"`,
                description: `Verification completed for ${project.title}`,
                project_name: project.title,
                timestamp: req.updated_at || req.created_at,
                status: req.status,
                media_count: req.verification_media?.length || 0
              });
            }
          });
        });

        // Filter activities with valid timestamps before sorting
        const validActivities = activities.filter(activity => activity.timestamp && !isNaN(new Date(activity.timestamp).getTime()));
        
        validActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentActivity(validActivities.slice(0, 10));

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err.message)
        setError(err.message || 'Failed to load dashboard data.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!loading && user) {
      fetchDashboardData()
    }
  }, [user, loading, router, supabase])

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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

  if (loading || dataLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Loading dashboard...</p>
            <p className="text-sm text-gray-600">Fetching your project data</p>
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
              Error Loading Dashboard
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 🇳🇬
              </h2>
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Here's your project portfolio overview for today
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Zap className="h-3 w-3 mr-1" />
                All systems operational
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Enhanced Tabs Layout */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderDot className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="verifications" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Verifications</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Recent Projects
                      </CardTitle>
                      <Link href="/projects">
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {project.title}
                          </h4>
                          <Badge className={`text-xs ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {project.location}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(Number(project.estimated_value || 0))}
                          </span>
                          <Link href={`/projects/${project.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Notifications */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/projects/new" className="block">
                      <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-200">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create New Project
                      </Button>
                    </Link>
                    <Link href="/verifications" className="block">
                      <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200">
                        <Camera className="h-4 w-4 mr-2" />
                        Request Verification
                      </Button>
                    </Link>
                    <Link href="/reports" className="block">
                      <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-200">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recent Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Recent Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notifications.slice(0, 4).map((notification) => (
                      <div key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                          {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                          {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                          {notification.type === 'info' && <Info className="h-4 w-4 text-blue-500 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {getTimeAgo(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Projects ({filteredProjects.length})
              </h3>
              <Link href="/projects/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-900">{stats.pendingVerifications}</p>
                  <p className="text-sm text-yellow-700">Pending Requests</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{stats.activeVerifications}</p>
                  <p className="text-sm text-blue-700">In Progress</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">{stats.completedVerifications}</p>
                  <p className="text-sm text-green-700">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Verifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Verification Requests</CardTitle>
                  <Link href="/verifications">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.flatMap(project => 
                    project.verification_requests?.map(request => ({
                      ...request,
                      project_title: project.title,
                      project_location: project.location
                    })) || []
                  ).slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          request.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                          request.status === 'completed' ? 'bg-green-100 text-green-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {request.status === 'pending' && <Clock className="h-5 w-5" />}
                          {request.status === 'in_progress' && <Camera className="h-5 w-5" />}
                          {request.status === 'completed' && <CheckCircle className="h-5 w-5" />}
                          {request.status === 'cancelled' && <AlertCircle className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {request.project_title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {request.project_location} • {getTimeAgo(request.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity Timeline
                </CardTitle>
                <CardDescription>
                  Track all activities across your projects and verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {getTimeAgo(activity.timestamp)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.description}
                        </p>
                        {activity.media_count && activity.media_count > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            {activity.media_count} media file(s) included
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

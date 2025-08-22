'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { Database } from '@/lib/database.types'

import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ProjectCard from '@/components/dashboard/ProjectCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  PlusCircle, 
  Search, 
  FolderDot,
  AlertCircle,
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

export default function ProjectsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<ProjectWithDetails[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

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

        // Fetch projects with verification requests and media
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
        console.error('Error fetching projects:', err.message)
        setError(err.message || 'Failed to load projects.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!loading && user) {
      fetchData()
    }
  }, [user, loading, router, supabase])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesType = typeFilter === 'all' || project.project_type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getProjectStats = () => {
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      pending: projects.filter(p => p.status === 'pending').length,
      suspended: projects.filter(p => p.status === 'suspended').length
    }
  }

  const stats = getProjectStats()

  if (loading || dataLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Loading your projects...</p>
            <p className="text-sm text-gray-600">Fetching project data and verifications</p>
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
              Error Loading Projects
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">My Projects</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 truncate">
              Manage and track your diaspora-funded projects
            </p>
          </div>
          <Link href="/projects/new" className="flex-shrink-0">
            <Button className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4">
              <PlusCircle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden ml-1">New</span>
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.active}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Active</p>
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
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.suspended}</p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Suspended</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-sm sm:text-base sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="text-sm sm:text-base sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderDot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {projects.length === 0 
                  ? 'Start by creating your first project to track your diaspora investments.'
                  : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                }
              </p>
              {projects.length === 0 && (
                <Link href="/projects/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
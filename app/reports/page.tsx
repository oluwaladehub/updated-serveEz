'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { Database } from '@/lib/database.types'

import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  Download,
  FileText,
  PieChart,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera
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

interface ReportData {
  totalInvestment: number
  totalProjects: number
  averageProjectValue: number
  completionRate: number
  verificationRate: number
  monthlyTrend: number
  projectsByType: { [key: string]: number }
  projectsByStatus: { [key: string]: number }
  projectsByLocation: { [key: string]: number }
  monthlyInvestments: { month: string; amount: number }[]
  recentActivity: { date: string; activity: string; project: string }[]
}

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<ProjectWithDetails[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('overview')

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
          .eq('read', false)
          .order('created_at', { ascending: false })
          .limit(5)

        if (notificationsError) throw notificationsError
        setNotifications(notificationsData || [])

        generateReportData(projectsData || [])

      } catch (err: any) {
        console.error('Error fetching reports data:', err.message)
        setError(err.message || 'Failed to load reports.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!loading && user) {
      fetchData()
    }
  }, [user, loading, router, supabase])

  function generateReportData(projectsData: ProjectWithDetails[]) {
    const totalInvestment = projectsData.reduce((acc, project) => 
      acc + (Number(project.estimated_value) || 0), 0)
    
    const totalProjects = projectsData.length
    const averageProjectValue = totalProjects > 0 ? totalInvestment / totalProjects : 0
    
    const completedProjects = projectsData.filter(p => p.status === 'completed').length
    const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
    
    const projectsWithVerifications = projectsData.filter(p => 
      p.verification_requests && p.verification_requests.length > 0).length
    const verificationRate = totalProjects > 0 ? (projectsWithVerifications / totalProjects) * 100 : 0
    
    const monthlyTrend = 15.2
    
    const projectsByType = projectsData.reduce((acc, project) => {
      const type = project.project_type || 'other'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    const projectsByStatus = projectsData.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    // Group by location (simplified - by state/city)
    const projectsByLocation = projectsData.reduce((acc, project) => {
      const location = project.location.split(',')[0].trim() // Get first part of location
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    // Replace mock with real monthly investments
    const monthlyMap = projectsData.reduce((acc, project) => {
      const date = new Date(project.created_at);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const amount = Number(project.estimated_value) || 0;
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, amount: 0 };
      }
      acc[monthKey].amount += amount;
      return acc;
    }, {} as Record<string, { month: string; amount: number }>);
    
    const monthlyInvestments = Object.values(monthlyMap)
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
    
    // Recent activity from projects
    // Enhanced recent activity including verification events
    const recentActivity: { date: string; activity: string; project: string }[] = [];
    projectsData.forEach(project => {
      // Project created
      recentActivity.push({
        date: new Date(project.created_at).toLocaleDateString(),
        activity: `Project "${project.title}" created`,
        project: project.title
      });

      project.verification_requests?.forEach(req => {
        // Submitted (pending)
        recentActivity.push({
          date: new Date(req.created_at).toLocaleDateString(),
          activity: `Verification submitted for "${project.title}"`,
          project: project.title
        });

        // If there's an updated_at or status change tracking, but assuming we use created_at for simplicity
        // In progress - assuming status change, but since we don't have timestamp for status changes, we'll add if status is in_progress
        if (req.status === 'in_progress') {
          recentActivity.push({
            date: new Date(req.updated_at || req.created_at).toLocaleDateString(),
            activity: `Verification in progress for "${project.title}"`,
            project: project.title
          });
        }

        // Completed
        if (req.status === 'completed') {
          recentActivity.push({
            date: new Date(req.updated_at || req.created_at).toLocaleDateString(),
            activity: `Verification completed for "${project.title}"`,
            project: project.title
          });
        }
      });
    });

    // Sort by date descending
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setReportData({
      totalInvestment,
      totalProjects,
      averageProjectValue,
      completionRate,
      verificationRate,
      monthlyTrend,
      projectsByType,
      projectsByStatus,
      projectsByLocation,
      monthlyInvestments,
      recentActivity
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const exportReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    alert('Report export functionality would be implemented here')
  }

  if (loading || dataLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Generating reports...</p>
            <p className="text-sm text-gray-600">Analyzing your project data</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error || 'Failed to generate report data'}</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Comprehensive insights into your diaspora investment portfolio
            </p>
          </div>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Investment</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(reportData.totalInvestment)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-blue-700 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +{reportData.monthlyTrend}% this month
                  </div>
                </div>
                <div className="bg-blue-600 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Projects</p>
                  <p className="text-2xl font-bold text-green-900">{reportData.totalProjects}</p>
                  <p className="text-xs text-green-700 mt-1">
                    Avg: {formatCurrency(reportData.averageProjectValue)}
                  </p>
                </div>
                <div className="bg-green-600 p-3 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{reportData.completionRate.toFixed(1)}%</p>
                  <p className="text-xs text-purple-700 mt-1">Project success rate</p>
                </div>
                <div className="bg-purple-600 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Verification Rate</p>
                  <p className="text-2xl font-bold text-orange-900">{reportData.verificationRate.toFixed(1)}%</p>
                  <p className="text-xs text-orange-700 mt-1">Projects verified</p>
                </div>
                <div className="bg-orange-600 p-3 rounded-full">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Project Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(reportData.projectsByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'completed' ? 'bg-green-500' :
                          status === 'active' ? 'bg-blue-500' :
                          status === 'pending' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="capitalize text-gray-700 dark:text-gray-300">{status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                        <span className="text-sm text-gray-500">
                          ({((count / reportData.totalProjects) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Project Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Project Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(reportData.projectsByType).map(([type, count]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="capitalize text-gray-700 dark:text-gray-300">
                          {type.replace('_', ' ')}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                      </div>
                      <Progress 
                        value={(count / reportData.totalProjects) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(reportData.projectsByLocation).slice(0, 5).map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{location}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                        <Badge variant="outline" className="text-xs">
                          {((count / reportData.totalProjects) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reportData.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {activity.activity}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{reportData.totalProjects}</p>
                  <p className="text-sm text-blue-700">Total Projects</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">
                    {Object.values(reportData.projectsByStatus).reduce((acc, val) => 
                      acc + (reportData.projectsByStatus.completed || 0), 0)}
                  </p>
                  <p className="text-sm text-green-700">Completed</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-900">
                    {(reportData.projectsByStatus.active || 0) + (reportData.projectsByStatus.pending || 0)}
                  </p>
                  <p className="text-sm text-yellow-700">In Progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Project Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Project Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Overall Completion Rate
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {reportData.completionRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={reportData.completionRate} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Verification Coverage
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {reportData.verificationRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={reportData.verificationRate} className="h-3" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Average Project Value
                      </h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(reportData.averageProjectValue)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Monthly Growth
                      </h4>
                      <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-5 w-5" />
                        +{reportData.monthlyTrend}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-green-900">
                    {formatCurrency(reportData.totalInvestment)}
                  </p>
                  <p className="text-sm text-green-700">Total Investment</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-blue-900">
                    {formatCurrency(reportData.averageProjectValue)}
                  </p>
                  <p className="text-sm text-blue-700">Average Project</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-purple-900">+{reportData.monthlyTrend}%</p>
                  <p className="text-sm text-purple-700">Monthly Growth</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-orange-900">
                    {formatCurrency(reportData.totalInvestment / 12)}
                  </p>
                  <p className="text-sm text-orange-700">Monthly Average</p>
                </CardContent>
              </Card>
            </div>

            {/* Investment Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Investment Timeline (Last 6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.monthlyInvestments.map((month) => (
                    <div key={month.month} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-300">
                        {month.month}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(month.amount)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {((month.amount / Math.max(...reportData.monthlyInvestments.map(m => m.amount))) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={(month.amount / Math.max(...reportData.monthlyInvestments.map(m => m.amount))) * 100} 
                          className="h-2"
                        />
                      </div>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {activity.activity}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {activity.date}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Project: {activity.project}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{reportData.recentActivity.length}</p>
                  <p className="text-sm text-blue-700">Recent Activities</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Camera className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">
                    {projects.reduce((acc, p) => acc + (p.verification_requests?.length || 0), 0)}
                  </p>
                  <p className="text-sm text-green-700">Verifications</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                  <p className="text-sm text-purple-700">Active Projects</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

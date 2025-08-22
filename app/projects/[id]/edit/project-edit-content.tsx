'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Building,
  MapPin,
  DollarSign,
  Lightbulb,
  Users,
  Target,
  Clock,
  Info
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface Project {
  id: string
  user_id: string
  title: string
  description: string
  location: string
  project_type: string
  estimated_value: number
  currency: string
  timeline: string
  beneficiaries: string
  goals: string
  status: 'pending' | 'active' | 'completed' | 'suspended'
  created_at: string
  updated_at: string
}

export function ProjectEditContent({ id }: { id: string }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [project, setProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({})
  const [dataLoading, setDataLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasActiveVerificationRequest, setHasActiveVerificationRequest] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    const fetchProject = async () => {
      if (!user) return

      setDataLoading(true)
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*, timeline, beneficiaries, goals')
          .eq('id', id)
          .eq('user_id', user.id) 
          .single()

        if (error) {
          if (error.code === 'PGRST116') { 
            setError('Project not found or you do not have permission to edit it.')
          } else {
            throw error
          }
        }

        const { data: activeVerifications, error: verificationError } = await supabase
          .from('verification_requests')
          .select('id, status')
          .eq('project_id', id)
          .in('status', ['pending', 'in_progress', 'completed'])

        if (verificationError) throw verificationError

        const hasActive = activeVerifications && activeVerifications.length > 0;
        setHasActiveVerificationRequest(hasActive);

        if (hasActive) {
          setError('This project cannot be edited because it has active verification requests.')
          setProject(data)
        } else {
          setProject(data)
          setFormData(data || {})
        }

      } catch (err: any) {
        console.error('Error fetching project for edit:', err.message)
        setError(err.message || 'Failed to load project for editing.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchProject()
    }
  }, [authLoading, user, router, supabase, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: keyof Partial<Project>) => (value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !project) return

    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('projects')
        .update(formData)
        .eq('id', project.id)
        .eq('user_id', user.id) 

      if (error) throw error

      toast.success('Project updated successfully!')
      router.push(`/projects/${project.id}`)
    } catch (err: any) {
      console.error('Error updating project:', err.message)
      setError(err.message || 'Failed to update project.')
      toast.error('Failed to update project.', { description: err.message || 'An unexpected error occurred.' })
    } finally {
      setIsSubmitting(false)
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
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => router.back()} className="flex-1">Back</Button>
              <Link href="/projects">
                <Button variant="outline" className="flex-1">Back to Projects</Button>
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
              The project you're looking for doesn't exist or you don't have permission.
            </p>
            <Link href="/projects">
              <Button className="w-full">Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Link href={`/projects/${project?.id}`}>
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Project</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6 sm:h-8 hidden sm:block" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Edit Project</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  Update project details and information
                </p>
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 flex-shrink-0"
              size="sm"
            >
              {isSubmitting ? (
                <span className="text-xs sm:text-sm">Saving...</span>
              ) : (
                <>
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Project Status</h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This project is currently <span className="font-semibold capitalize">{project?.status?.replace('_', ' ')}</span>.
              {hasActiveVerificationRequest && (
                <> Projects with active verification requests cannot be edited.</>
              )}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Building className="h-6 w-6" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Core project details and identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2 text-sm sm:text-base">
                      <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                      Project Title
                    </Label>
                    <Input 
                      id="title" 
                      value={formData.title || ''} 
                      onChange={handleChange} 
                      className="bg-white dark:bg-gray-800 text-sm sm:text-base"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      Location
                    </Label>
                    <Input 
                      id="location" 
                      value={formData.location || ''} 
                      onChange={handleChange} 
                      className="bg-white dark:bg-gray-800 text-sm sm:text-base"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Description
                  </Label>
                  <Textarea 
                    id="description" 
                    value={formData.description || ''} 
                    onChange={handleChange} 
                    rows={5} 
                    className="bg-white dark:bg-gray-800"
                    required 
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="timeline" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </Label>
                  <Textarea 
                    id="timeline" 
                    value={formData.timeline || ''} 
                    onChange={handleChange} 
                    rows={3} 
                    className="bg-white dark:bg-gray-800"
                    placeholder="e.g., Phase 1: Planning (Jan-Mar), Phase 2: Construction (Apr-Sep)" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaries" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Beneficiaries
                  </Label>
                  <Textarea 
                    id="beneficiaries" 
                    value={formData.beneficiaries || ''} 
                    onChange={handleChange} 
                    rows={3} 
                    className="bg-white dark:bg-gray-800"
                    placeholder="e.g., Local community members, Small businesses, Environmental organizations" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Goals
                  </Label>
                  <Textarea 
                    id="goals" 
                    value={formData.goals || ''} 
                    onChange={handleChange} 
                    rows={3} 
                    className="bg-white dark:bg-gray-800"
                    placeholder="e.g., Improve infrastructure, Create job opportunities, Reduce carbon footprint" 
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="project_type" className="flex items-center gap-2 text-sm sm:text-base">
                      <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                      Project Type
                    </Label>
                    <Select 
                      onValueChange={handleSelectChange('project_type')} 
                      value={formData.project_type || ''}
                    >
                      <SelectTrigger id="project_type" className="bg-white dark:bg-gray-800 text-sm sm:text-base">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="community_development">Community Development</SelectItem>
                        <SelectItem value="environmental">Environmental</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="economic">Economic</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_value" className="flex items-center gap-2 text-sm sm:text-base">
                      <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 font-bold">₦</span>
                      Estimated Value
                    </Label>
                    <Input
                      id="estimated_value"
                      type="number"
                      value={formData.estimated_value || ''}
                      onChange={handleChange}
                      className="bg-white dark:bg-gray-800 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 font-bold">₦</span>
                    Currency
                  </Label>
                  <Select 
                    onValueChange={handleSelectChange('currency')} 
                    value={formData.currency || ''}
                  >
                    <SelectTrigger id="currency" className="bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD - United States Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting || hasActiveVerificationRequest}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
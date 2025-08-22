'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Building, 
  Home, 
  Car, 
  Store, 
  FolderDot,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Camera,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import type { Database } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type Project = Database['public']['Tables']['projects']['Row']
type VerificationRequest = Database['public']['Tables']['verification_requests']['Row']
type VerificationMedia = Database['public']['Tables']['verification_media']['Row']

interface ProjectWithDetails extends Project {
  verification_requests: (VerificationRequest & {
    verification_media: VerificationMedia[]
  })[]
}

interface ProjectCardProps {
  project: ProjectWithDetails
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const hasVerificationRequests = project.verification_requests && project.verification_requests.length > 0

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      // Optimistically hide the card
      const cardElement = document.getElementById(`project-${project.id}`);
      if (cardElement) {
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'scale(0.95)';
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (error) throw error

      // Silent refresh after successful deletion
      startTransition(() => {
        router.refresh();
      });

      toast.success('Project deleted successfully', {
        duration: 3000,
      })
    } catch (error: any) {
      // Restore the card if deletion fails
      const cardElement = document.getElementById(`project-${project.id}`);
      if (cardElement) {
        cardElement.style.opacity = '1';
        cardElement.style.transform = 'scale(1)';
      }

      toast.error('Failed to delete project', {
        description: error.message
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getProjectProgress = (project: ProjectWithDetails) => {
    const requests = project.verification_requests || []
    if (requests.length === 0) return 0
    const completed = requests.filter(req => req.status === 'completed').length
    return Math.round((completed / requests.length) * 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProjectTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'construction': return <Building className="h-5 w-5" />
      case 'real_estate': return <Home className="h-5 w-5" />
      case 'vehicle': return <Car className="h-5 w-5" />
      case 'business': return <Store className="h-5 w-5" />
      default: return <FolderDot className="h-5 w-5" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card 
      id={`project-${project.id}`} 
      className="hover:shadow-lg transition-all duration-300 group"
      style={{ transition: 'all 0.3s ease-in-out' }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              {getProjectTypeIcon(project.project_type || '')}
            </div>
            <div>
              <Link href={`/projects/${project.id}`}>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors cursor-pointer hover:underline">
                  {project.title}
                </h4>
              </Link>
              <Badge className={`${getStatusColor(project.status)} text-xs`}>
                {project.status}
              </Badge>
            </div>
          </div>
          {!hasVerificationRequests && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/projects/${project.id}/edit`}>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Project
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Project
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <span className="font-semibold">{project.title}</span>? 
                        This action cannot be undone and will permanently remove the project and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Project'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            {project.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            {new Date(project.created_at).toLocaleDateString()}
          </div>
          {project.estimated_value && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              
              {formatCurrency(Number(project.estimated_value))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {getProjectProgress(project)}%
            </span>
          </div>
          <Progress value={getProjectProgress(project)} className="h-2" />
        </div>

        {project.verification_requests && project.verification_requests.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                {project.verification_requests.length} verification(s)
              </span>
              <div className="flex items-center gap-1">
                <Camera className="h-3 w-3" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {project.verification_requests.reduce((acc, req) => 
                    acc + (req.verification_media?.length || 0), 0)} media
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </Link>
          <Link href={`/verifications/new?project_id=${project.id}`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Camera className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}


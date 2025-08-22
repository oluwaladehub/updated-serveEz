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
  Camera,
  FileVideo,
  FileAudio,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'

interface VerificationRequest {
  id: string
  project_id: string
  user_id: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
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
  title: string
  description: string
  location: string
}

export function GalleryContent({ id }: { id: string }) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [verification, setVerification] = useState<VerificationRequest | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<VerificationMedia | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all')

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
            id,
            project_id,
            user_id,
            status,
            created_at,
            updated_at,
            verification_media (
              id,
              verification_request_id,
              file_path,
              file_name,
              file_type,
              file_size,
              caption,
              metadata,
              visibility,
              uploaded_by_admin,
              created_at
            ),
            project:projects (
              id,
              title,
              description,
              location
            )
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        const transformedData = {
          ...data,
          project: Array.isArray(data.project) && data.project.length > 0
            ? data.project[0]
            : { id: '', title: 'Unknown Project', description: '', location: '' }
        }

        setVerification(transformedData)
      } catch (err: any) {
        console.error('Error fetching verification:', err.message)
        setError(err.message || 'Failed to load verification gallery.')
      } finally {
        setDataLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchVerificationData()
    }
  }, [authLoading, user, router, supabase, id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const getFilteredMedia = () => {
    if (!verification?.verification_media) return []

    return verification.verification_media.filter(media =>
      mediaFilter === 'all' || media.file_type === mediaFilter
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const handleMediaClick = (media: VerificationMedia, index: number) => {
    setSelectedMedia(media)
    setSelectedIndex(index)
  }

  const navigateMedia = (direction: 'next' | 'prev') => {
    const filteredMedia = getFilteredMedia()
    if (filteredMedia.length === 0) return

    let newIndex = selectedIndex
    if (direction === 'next') {
      newIndex = (selectedIndex + 1) % filteredMedia.length
    } else {
      newIndex = (selectedIndex - 1 + filteredMedia.length) % filteredMedia.length
    }

    setSelectedIndex(newIndex)
    setSelectedMedia(filteredMedia[newIndex])
  }

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <ImageIcon className="h-8 w-8 text-blue-500" />
      case 'video': return <FileVideo className="h-8 w-8 text-red-500" />
      case 'audio': return <FileAudio className="h-8 w-8 text-green-500" />
      default: return <FileAudio className="h-8 w-8 text-gray-500" />
    }
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
              Error Loading Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()} className="flex-1">
                Try Again
              </Button>
              <Link href={`/verifications/${id}`}>
                <Button variant="outline" className="flex-1">
                  Back to Verification
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

  const filteredMedia = getFilteredMedia()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href={`/verifications/${id}`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Verification
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Media Gallery
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {verification.project?.title || 'Project Details'}
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor(verification.status)} px-3 py-1`}>
              <span className="capitalize">{verification.status.replace('_', ' ')}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${mediaFilter === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                onClick={() => setMediaFilter('all')}
              >
                All Media ({verification.verification_media?.length || 0})
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${mediaFilter === 'image'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                onClick={() => setMediaFilter('image')}
              >
                Images ({verification.verification_media?.filter(m => m.file_type === 'image').length || 0})
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${mediaFilter === 'video'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                onClick={() => setMediaFilter('video')}
              >
                Videos ({verification.verification_media?.filter(m => m.file_type === 'video').length || 0})
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${mediaFilter === 'audio'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                onClick={() => setMediaFilter('audio')}
              >
                Audio ({verification.verification_media?.filter(m => m.file_type === 'audio').length || 0})
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Camera className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {mediaFilter !== 'all' ? `No ${mediaFilter} files available` : (
                verification.status === 'in_progress' ? 'We\'re Working On It' : 'No Media Available'
              )}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
              {mediaFilter !== 'all' ? (
                `No ${mediaFilter} files have been uploaded yet.`
              ) : (
                verification.status === 'pending' ? (
                  'Your verification request is pending. Media will be available once our team begins the verification process.'
                ) : verification.status === 'in_progress' ? (
                  'Our verification team is actively working on your request. Media files will be uploaded here as they become available. Check back soon!'
                ) : verification.status === 'completed' ? (
                  'Your verification has been completed, but no media files were uploaded.'
                ) : (
                  'This verification request has been cancelled.'
                )
              )}
            </p>

            {verification.status === 'in_progress' && (
              <div className="mt-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative h-2 w-80 bg-blue-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-blue-500 animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <p className="text-blue-600 dark:text-blue-400 mb-4">
                  <Clock className="h-5 w-5 inline mr-2 mb-0.5" />
                  Verification in progress
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((media, index) => (
              <div
                key={media.id}
                className="group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => handleMediaClick(media, index)}
              >
                {media.file_type === 'image' ? (
                  <img
                    src={media.file_path}
                    alt={media.caption || `Verification image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : media.file_type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <FileVideo className="h-12 w-12 text-white opacity-80" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                    <FileAudio className="h-12 w-12 text-white opacity-80" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-xs text-white truncate">
                    {media.caption || media.file_name || `File ${index + 1}`}
                  </p>
                </div>
                {media.uploaded_by_admin && (
                  <Badge className="absolute top-2 right-2 bg-blue-500 text-white text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Media Viewer Dialog */}
        <Dialog open={selectedMedia !== null} onOpenChange={(open) => !open && setSelectedMedia(null)}>
          <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-gray-800">
            <div className="relative h-[80vh] flex flex-col">
              {/* Top bar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  {getFileTypeIcon(selectedMedia?.file_type || 'image')}
                  <span className="text-white font-medium truncate max-w-[300px]">
                    {selectedMedia?.caption || selectedMedia?.file_name || 'Verification Media'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMedia?.file_path && (
                    <a href={selectedMedia.file_path} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                      <X className="h-5 w-5" />
                    </Button>
                  </DialogClose>
                </div>
              </div>

              {/* Media content */}
              <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                {selectedMedia?.file_type === 'image' ? (
                  <img
                    src={selectedMedia.file_path}
                    alt={selectedMedia.caption || 'Verification image'}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : selectedMedia?.file_type === 'video' ? (
                  <video
                    src={selectedMedia.file_path}
                    controls
                    className="max-h-full max-w-full"
                  />
                ) : selectedMedia?.file_type === 'audio' ? (
                  <div className="bg-gray-800 p-8 rounded-lg flex flex-col items-center">
                    <FileAudio className="h-20 w-20 text-gray-300 mb-4" />
                    <audio
                      src={selectedMedia.file_path}
                      controls
                      className="w-full"
                    />
                  </div>
                ) : null}

                {/* Navigation buttons */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full opacity-70 hover:opacity-100 pointer-events-auto"
                    onClick={() => navigateMedia('prev')}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full opacity-70 hover:opacity-100 pointer-events-auto"
                    onClick={() => navigateMedia('next')}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Bottom info */}
              {selectedMedia && (
                <div className="bg-gray-900 p-4 border-t border-gray-800 text-white">
                  <div className="flex flex-col gap-2">
                    {selectedMedia.caption && (
                      <p className="text-sm text-gray-300">{selectedMedia.caption}</p>
                    )}
                    <div className="flex items-center text-xs text-gray-400 gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(selectedMedia.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {formatFileSize(selectedMedia.file_size)}
                      </span>
                      {selectedMedia.uploaded_by_admin && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          Uploaded by Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 
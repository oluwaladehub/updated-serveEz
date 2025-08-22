'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/sonner'
import {
  ArrowLeft,
  Building,
  Home,
  Car,
  Store,
  Factory,
  GraduationCap,
  Heart,
  Zap,
  MapPin,
  FileText,
  CheckCircle,
  Eye,
  Lightbulb,
  Target,
  Calendar,
  Users
} from 'lucide-react'

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
]

const projectTypes = [
  { value: 'residential', label: 'Residential Building', icon: Home, color: 'bg-blue-500' },
  { value: 'commercial', label: 'Commercial Building', icon: Building, color: 'bg-green-500' },
  { value: 'retail', label: 'Retail/Shop', icon: Store, color: 'bg-purple-500' },
  { value: 'industrial', label: 'Industrial/Factory', icon: Factory, color: 'bg-orange-500' },
  { value: 'educational', label: 'Educational Facility', icon: GraduationCap, color: 'bg-indigo-500' },
  { value: 'healthcare', label: 'Healthcare Facility', icon: Heart, color: 'bg-red-500' },
  { value: 'infrastructure', label: 'Infrastructure', icon: Zap, color: 'bg-yellow-500' },
  { value: 'automotive', label: 'Automotive', icon: Car, color: 'bg-gray-500' },
  { value: 'other', label: 'Other', icon: Target, color: 'bg-pink-500' }
]

const formSchema = z.object({
  title: z.string().min(3, 'Project title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  project_type: z.string().min(1, 'Please select a project type'),
  state: z.string().min(1, 'Please select a state'),
  address: z.string().min(5, 'Please provide a detailed address').max(200, 'Address too long'),
  estimated_value: z.string().min(1, 'Please enter estimated value').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Please enter a valid amount'
  ),
  currency: z.string().default('NGN'),
  timeline: z.string().min(1, 'Please provide an estimated timeline').max(100, 'Timeline description too long'),
  beneficiaries: z.string().min(1, 'Please describe who will benefit from this project').max(500, 'Beneficiaries description too long'),
  goals: z.string().min(1, 'Please state the main goals of this project').max(500, 'Goals description too long')
})

type FormData = z.infer<typeof formSchema>

export default function NewProjectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      project_type: '',
      state: '',
      address: '',
      estimated_value: '',
      currency: 'NGN',
      timeline: '',
      beneficiaries: '',
      goals: ''
    },
  })

  const watchedValues = form.watch()
  const selectedProjectType = projectTypes.find(type => type.value === watchedValues.project_type)

  if (!loading && !user) {
    router.push('/login?redirectTo=/projects/new')
    return null
  }

  const formatCurrency = (amount: string) => {
    if (!amount) return ''
    const num = Number(amount.replace(/[^0-9]/g, ''))
    return new Intl.NumberFormat('en-NG').format(num)
  }

  const handleCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    form.setValue('estimated_value', numericValue)
  }

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('You must be logged in to create a project')
      return
    }

    setIsSubmitting(true)

    try {
      const location = `${data.address}, ${data.state}, Nigeria`

      const projectData = {
        user_id: user.id,
        title: data.title.trim(),
        description: data.description.trim(),
        location: location,
        project_type: data.project_type,
        estimated_value: Number(data.estimated_value),
        currency: data.currency,
        status: 'pending' as const,
        timeline: data.timeline.trim(),
        beneficiaries: data.beneficiaries.trim(),
        goals: data.goals.trim()
      }

      const { data: project, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single()

      if (error) throw error

      await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          title: 'Project Created Successfully',
          message: `Your project "${data.title}" has been created and is pending review.`,
          type: 'success',
          related_id: project.id,
          related_type: 'project'
        }])

      toast.success('Project created successfully!')
      router.push(`/projects/${project.id}`)
    } catch (error: any) {
      console.error('Error creating project:', error)
      toast.error(error.message || 'Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      let fieldsToValidate: (keyof FormData)[] = []
      
      switch (currentStep) {
        case 1:
          fieldsToValidate = ['title', 'description', 'project_type']
          break
        case 2:
          fieldsToValidate = ['state', 'address', 'estimated_value']
          break
        case 3:
          fieldsToValidate = ['timeline', 'beneficiaries', 'goals']
          break
      }

      const isValid = await form.trigger(fieldsToValidate)
      
      if (isValid) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepValidation = () => {
    switch (currentStep) {
      case 1:
        return form.formState.errors.title || form.formState.errors.description || form.formState.errors.project_type
      case 2:
        return form.formState.errors.state || form.formState.errors.address || form.formState.errors.estimated_value
      case 3:
        return form.formState.errors.timeline || form.formState.errors.beneficiaries || form.formState.errors.goals
      default:
        return false
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return watchedValues.title && watchedValues.description && watchedValues.project_type
      case 2:
        return watchedValues.state && watchedValues.address && watchedValues.estimated_value
      case 3:
        return watchedValues.timeline && watchedValues.beneficiaries && watchedValues.goals
      default:
        return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <Toaster position="top-center" />
      
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors px-2 sm:px-3">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Projects</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-600 hidden sm:block" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Create New Project</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full flex-shrink-0">
              <Lightbulb className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Draft Mode</span>
              <span className="sm:hidden">Draft</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-16 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
            <span className="text-xs sm:text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          
          <div className="flex justify-between mt-3 sm:mt-4">
            <div className={`flex flex-col items-center gap-1 sm:gap-2 text-center transition-colors duration-200 ${currentStep >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 ${currentStep >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {currentStep > 1 ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : '1'}
              </div>
              <span className="text-xs font-medium mt-1 hidden sm:block">Project Details</span>
              <span className="text-xs font-medium mt-1 sm:hidden">Details</span>
            </div>
            <div className={`flex flex-col items-center gap-1 sm:gap-2 text-center transition-colors duration-200 ${currentStep >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 ${currentStep >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                {currentStep > 2 ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : '2'}
              </div>
              <span className="text-xs font-medium mt-1 hidden sm:block">Location & Budget</span>
              <span className="text-xs font-medium mt-1 sm:hidden">Location</span>
            </div>
            <div className={`flex flex-col items-center gap-1 sm:gap-2 text-center transition-colors duration-200 ${currentStep >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 ${currentStep >= 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                3
              </div>
              <span className="text-xs font-medium mt-1 hidden sm:block">Additional Info</span>
              <span className="text-xs font-medium mt-1 sm:hidden">Info</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-gray-100 dark:border-gray-700 rounded-lg">
              <CardHeader className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-extrabold">
                  {currentStep === 1 && <FileText className="h-6 w-6" />}
                  {currentStep === 2 && <MapPin className="h-6 w-6" />}
                  {currentStep === 3 && <Target className="h-6 w-6" />}
                  {currentStep === 1 && 'Project Details'}
                  {currentStep === 2 && 'Location & Budget'}
                  {currentStep === 3 && 'Additional Information'}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {currentStep === 1 && 'Tell us about your project and what you want to build'}
                  {currentStep === 2 && 'Where is your project located and what\'s the estimated cost?'}
                  {currentStep === 3 && 'Optional details to help us better understand your project'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                <Form {...form}>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (currentStep === totalSteps) {
                        form.handleSubmit(onSubmit)(e)
                      } else {
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (currentStep < totalSteps) {
                          e.preventDefault()
                          nextStep() 
                        } else {
                        }
                      }
                    }}
                    className="space-y-6"
                  >
                    {/* Step 1: Project Details */}
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-fade-in">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Project Title *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Modern Family Home in Lagos"
                                  className="h-12 text-base px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Give your project a clear, descriptive name
                              </FormDescription>
                              <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="project_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Project Type *</FormLabel>
                              <FormControl>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                  {projectTypes.map((type) => {
                                    const Icon = type.icon
                                    const isSelected = field.value === type.value
                                    return (
                                      <div
                                        key={type.value}
                                        onClick={() => field.onChange(type.value)}
                                        className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-2 sm:gap-3 ${isSelected
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 shadow-md transform scale-105'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
                                        }`}
                                      >
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${type.color} text-white shadow-lg`}>
                                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
                                          {type.label}
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </FormControl>
                              <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Project Description *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your project in detail. What are you building? What's the purpose? Who will benefit from it?"
                                  className="min-h-36 text-base px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-y"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Provide a detailed description of your project ({field.value?.length || 0}/1000 characters)
                              </FormDescription>
                              <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 2: Location & Budget */}
                    {currentStep === 2 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">State *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-12 text-base px-4 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                    {nigerianStates.map((state) => (
                                      <SelectItem key={state} value={state} className="dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {state}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-sm text-red-500" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="estimated_value"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">Estimated Value *</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                                    <Input
                                      placeholder="0"
                                      className="h-12 pl-10 pr-20 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                      value={formatCurrency(field.value)}
                                      onChange={(e) => handleCurrencyInput(e.target.value)}
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 px-3 py-1">
                                        NGN
                                      </Badge>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  Estimated total cost of the project in Nigerian Naira
                                </FormDescription>
                                <FormMessage className="text-sm text-red-500" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Detailed Address *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Plot 123, Admiralty Way, Lekki Phase 1, Lagos"
                                  className="min-h-36 text-base px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-y"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Provide the complete address including street, area, and landmarks
                              </FormDescription>
                              <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                          )}
                        />

                        {/* Preview */}
                        {watchedValues.address && watchedValues.state && (
                          <div className="p-5 bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-700 rounded-lg flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Project Location Preview</h4>
                              <p className="text-blue-700 dark:text-blue-300 text-sm">
                                {watchedValues.address}, {watchedValues.state}, Nigeria
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Almost Done! 🎉</h3>
                          <p className="text-gray-600 dark:text-gray-400">Add some optional details to help us better understand your project</p>
                        </div>

                        <FormField
                          control={form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                Expected Timeline
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 6 months, 1 year, 18 months"
                                  className="h-12 text-base px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                How long do you expect this project to take?
                              </FormDescription>
                              <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="beneficiaries"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                Who Will Benefit?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., My family of 6, Local community, Students, etc."
                                  className="min-h-36 text-base px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-y"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Tell us who will benefit from this project
                              </FormDescription>
                              <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="goals"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold flex items-center gap-2">
                                <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                Project Goals
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Provide safe housing, Create jobs, Improve education access, etc."
                                  className="min-h-36 text-base px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-y"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                What are the main goals and objectives of this project?
                              </FormDescription>
                              <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}


                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-6 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      {currentStep < totalSteps ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={!canProceed()}
                          className="flex items-center gap-2 px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next Step
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={isSubmitting || !canProceed()}
                          className="flex items-center gap-2 px-6 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              Creating Project...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Create Project
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-600 to-teal-700 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-extrabold">
                  <Eye className="h-6 w-6" />
                  Project Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-gray-900 dark:text-white text-lg">
                    {watchedValues.title || 'Your Project Title Goes Here'}
                  </h4>
                  {selectedProjectType && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${selectedProjectType.color} text-white shadow-md`}>
                        <selectedProjectType.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{selectedProjectType.label}</span>
                    </div>
                  )}
                </div>

                {watchedValues.description && (
                  <div className="border-l-2 border-blue-500 pl-4 py-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                      {watchedValues.description}
                    </p>
                  </div>
                )}

                {(watchedValues.address || watchedValues.state) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {watchedValues.address && `${watchedValues.address}${watchedValues.state ? ', ' : ''}`}
                        {watchedValues.state && `${watchedValues.state}, Nigeria`}
                      </p>
                    </div>
                  </div>
                )}

                {watchedValues.estimated_value && (
                  <div className="flex items-center gap-3">
                    {/* <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" /> */}
                    <span className="font-bold text-green-700 dark:text-green-300 text-lg">
                      ₦{formatCurrency(watchedValues.estimated_value)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            
            <Card className="shadow-lg border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-600 to-pink-700 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-extrabold">
                  <Lightbulb className="h-6 w-6" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Be specific with your project title and description to help verifiers understand your vision.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Include landmarks in your address to make location easier to find.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Accurate budget estimates help us provide better verification services.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    For Step 3, providing detailed timeline, beneficiaries, and goals will expedite the verification process.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            {/* <Card className="shadow-lg border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our team is here to help you create the perfect project listing. Feel free to reach out!
                </p>
                <Button variant="outline" size="sm" className="border-blue-400 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-colors px-5 py-2 rounded-md">
                  Contact Support
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  )
}



'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUp } from '@/lib/auth'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner' 

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' }),
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  country: z.string().min(1, { message: 'Country is required.' }),
  confirmPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const countries = [
  'Nigeria', 'Ghana', 'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'South Africa', 'Kenya', 'Egypt', 'Brazil', 'India', 'China', 'Japan'
];

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      phone: '',
      country: '',
      confirmPassword: '',
    },
  })

  const passwordValue = form.watch("password");
  const [hasTypedPassword, setHasTypedPassword] = useState(false);
  const passwordRequirements = [
    { text: "At least 8 characters", check: passwordValue.length >= 8 },
    { text: "One uppercase letter", check: /[A-Z]/.test(passwordValue) },
    { text: "One lowercase letter", check: /[a-z]/.test(passwordValue) },
    { text: "One number", check: /[0-9]/.test(passwordValue) },
    { text: "One special character", check: /[^a-zA-Z0-9]/.test(passwordValue) },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      await signUp(values.email, values.password, values.fullName, values.phone || null, values.country || null)
      toast.success('Signed up successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up')
      toast.error(error.message || 'An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 animate-fade-in">
      <Toaster position="top-center" /> {/* Add Toaster here */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-xl overflow-hidden animate-slide-in-up">
        {/* Left Side - Branding/Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-blue-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to ProjectVerify!</h2>
          <p className="text-lg mb-6">Securely manage your diaspora projects with visual proof.</p>
          {/* You can add an SVG illustration here */}
          <svg className="w-48 h-48 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign up to get started with trusted project verification
            </p>
          </div>

          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm animate-fade-in">
                      {error}
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., +1234567890"
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field} onChange={(e) => { field.onChange(e); setHasTypedPassword(true); } }
                          />
                        </FormControl>
                        <FormMessage />
                        {(passwordValue && hasTypedPassword) && (
                          <div className="mt-2 space-y-1 text-sm">
                            {passwordRequirements.map((req, index) => (
                              <p key={index} className={`flex items-center gap-2 ${req.check ? 'text-green-600' : 'text-red-600'}`}>
                                {req.check ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                {req.text}
                              </p>
                            ))}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Confirm your password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full mt-6 py-2 animate-bounce-in" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-6 text-center">
                <Link href="/" passHref>
                  <Button variant="link" className="text-gray-600 hover:text-gray-900">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
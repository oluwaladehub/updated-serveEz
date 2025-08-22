'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
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
} from '@/components/ui/alert-dialog'
import {
  Shield,
  Bell,
  Search,
  LogOut,
  Globe,
  Settings,
  Menu,
  X,
  Home,
  FolderOpen,
  CheckCircle,
  FileText
} from 'lucide-react'
import type { Database } from '@/lib/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Notification = Database['public']['Tables']['notifications']['Row']

interface DashboardHeaderProps {
  profile: Profile | null
  notifications: Notification[]
  searchTerm: string
  onSearchChange: (value: string) => void
}

export default function DashboardHeader({
  profile,
  notifications,
  searchTerm,
  onSearchChange
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '/verifications', label: 'Verifications', icon: CheckCircle },
    { href: '/reports', label: 'Reports', icon: FileText },
  ]

  return (
    <header className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 shadow-lg border-b border-blue-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Desktop Navigation */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-md">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">ProjectVerify</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Separator orientation="vertical" className="h-8 bg-blue-200 dark:bg-gray-600" />
              <nav className="flex space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-all duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700 dark:bg-gray-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden sm:flex items-center space-x-4">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-blue-300 dark:ring-blue-600 shadow-md">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || user?.email}`} />
                <AvatarFallback className="bg-blue-700 text-white font-bold text-sm">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {profile?.full_name || user?.email}
                </p>
                <Link href="/dashboard/settings" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300 group transition-colors">
                  <Globe className="h-3 w-3" />
                  {profile?.country || 'Location not set'}
                  <Settings className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out of your account and will need to sign in again to access the dashboard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={signOut}>Log Out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
                    <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      ProjectVerify
                    </SheetTitle>
                  </SheetHeader>

                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg mb-6">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-300 dark:ring-blue-600">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || user?.email}`} />
                      <AvatarFallback className="bg-blue-700 text-white font-bold">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {profile?.full_name || user?.email}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {profile?.country || 'Location not set'}
                      </p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-col gap-2 mb-6">
                    {navigationItems.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-colors font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <IconComponent className="h-5 w-5" />
                          {item.label}
                        </Link>
                      )
                    })}
                  </nav>

                  <Separator className="my-4" />

                  {/* Settings and Logout */}
                  <div className="flex flex-col gap-2">
                    {/* <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link> */}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors font-medium justify-start">
                          <LogOut className="h-5 w-5" />
                          Log Out
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be logged out of your account and will need to sign in again to access the dashboard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => {
                            signOut()
                            setIsMobileMenuOpen(false)
                          }}>
                            Log Out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
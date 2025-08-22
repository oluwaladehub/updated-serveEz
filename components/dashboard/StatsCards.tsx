'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  FolderDot, 
  Wallet, 
  Camera, 
  FileText,
  TrendingUp 
} from 'lucide-react'

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

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Projects</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalProjects}</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {stats.averageProgress}% avg progress
              </p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full">
              <FolderDot className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Investment</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatCurrency(stats.totalInvestment)}
              </p>
              <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-300 mt-1">
                <TrendingUp className="h-3 w-3" />
                +{stats.monthlyGrowth}% this month
              </div>
            </div>
            <div className="bg-green-600 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Active Verifications</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.activeVerifications}</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                {stats.pendingVerifications} pending
              </p>
            </div>
            <div className="bg-yellow-600 p-3 rounded-full">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Media Files</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalMediaFiles}</p>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                {stats.completedVerifications} verifications
              </p>
            </div>
            <div className="bg-purple-600 p-3 rounded-full">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
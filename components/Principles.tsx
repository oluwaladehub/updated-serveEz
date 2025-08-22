'use client'

import { Users, Shield, Eye, Clock, Award, Handshake } from 'lucide-react'

export default function Principles() {
  return (
    <section id="features" className="w-full max-w-7xl px-4 mb-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Our Foundation</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
          Guiding{' '}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Principles
          </span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          The core values that drive our commitment to excellence and shape every interaction with our clients.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* People-Centric Approach */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm border border-white/20 hover:border-blue-300/50 rounded-3xl p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-3xl"></div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Users className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
              People-Centric Approach
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              We empower diaspora investors by putting their peace of mind at the core of our operations.
            </p>
          </div>
        </div>

        {/* Transparency & Trust */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30 backdrop-blur-sm border border-white/20 hover:border-emerald-300/50 rounded-3xl p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-3xl"></div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Eye className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-600 transition-colors">
              Transparency & Trust
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              Complete transparency in all our processes, building lasting trust through honest communication.
            </p>
          </div>
        </div>

        {/* Security & Reliability */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm border border-white/20 hover:border-purple-300/50 rounded-3xl p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-3xl"></div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Shield className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 transition-colors">
              Security & Reliability
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              Your data and investments are protected with enterprise-grade security and reliable service delivery.
            </p>
          </div>
        </div>

        {/* Timely Delivery */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/30 dark:to-orange-950/30 backdrop-blur-sm border border-white/20 hover:border-yellow-300/50 rounded-3xl p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-t-3xl"></div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Clock className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 transition-colors">
              Timely Delivery
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              We respect your time and deliver all reports and updates according to agreed schedules.
            </p>
          </div>
        </div>

        {/* Excellence & Quality */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/30 dark:to-pink-950/30 backdrop-blur-sm border border-white/20 hover:border-red-300/50 rounded-3xl p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-t-3xl"></div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Award className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-red-600 transition-colors">
              Excellence & Quality
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              We maintain the highest standards in all our verification processes and reporting.
            </p>
          </div>
        </div>

        {/* Partnership Approach */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/30 dark:to-blue-950/30 backdrop-blur-sm border border-white/20 hover:border-indigo-300/50 rounded-3xl p-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-t-3xl"></div>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Handshake className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">
              Partnership Approach
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              We work as your trusted partner, not just a service provider, invested in your project's success.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 

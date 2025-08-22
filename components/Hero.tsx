'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Star, ArrowUpRight, Play, CheckCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto mt-16 mb-24 flex flex-col lg:flex-row items-center justify-between overflow-hidden rounded-3xl min-h-[700px] lg:h-[800px] animate-fade-in-up">
      {/* Background with improved gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
      
      {/* Animated Background Elements - More subtle */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Left Content Area - Enhanced */}
      <div className="relative z-10 p-8 lg:p-16 lg:w-3/5 text-center lg:text-left">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8 animate-fade-in-down">
          <Star className="h-4 w-4 text-emerald-400 fill-emerald-400" />
          <span className="text-sm font-medium text-white">Trusted by 500+ Diaspora Project Owners</span>
        </div>

        {/* Main Heading - Improved typography */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] mb-8 text-white animate-fade-in-down">
          Bridge the{' '}
          <span className="relative">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Trust Gap
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
          </span>
          {' '}for Your Projects
        </h1>

        {/* Subtitle - Better spacing */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed animate-fade-in-up">
          Get independent, verifiable insights into your personal projects back home, such as home construction. 
          <span className="text-white font-semibold"> Transform uncertainty into confidence.</span>
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-8 mb-10 justify-center lg:justify-start animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="text-2xl font-bold text-emerald-400">500+</div>
            <div className="text-sm text-gray-400">Projects Verified</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-2xl font-bold text-blue-400">98%</div>
            <div className="text-sm text-gray-400">Client Satisfaction</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-sm text-gray-400">Support Available</div>
          </div>
        </div>

        {/* CTA Buttons - Enhanced */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start animate-fade-in-up">
          <Link href="/signup" passHref>
            <Button className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25 text-lg border-0">
              Start Verification
              <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            No Setup Fees
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Money-Back Guarantee
          </div>
        </div>
      </div>

      {/* Right Visual Area - Completely redesigned */}
      <div className="relative lg:w-2/5 w-full h-96 lg:h-full flex items-center justify-center mt-8 lg:mt-0">
        {/* Main Visual Container */}
        <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px]">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Main Image */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm bg-white/5">
            <Image 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=1926&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Professional verification team"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
          </div>

          {/* Floating Cards */}
          <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-800">Live Verification</span>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float animation-delay-2000">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <div>
                <div className="text-sm font-semibold text-slate-800">Verified</div>
                <div className="text-xs text-slate-600">2 mins ago</div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-4 shadow-xl animate-float animation-delay-1000">
            <div className="text-center">
              <div className="text-lg font-bold">98%</div>
              <div className="text-xs opacity-90">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

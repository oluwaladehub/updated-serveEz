'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Star, ArrowUpRight, Settings2, Activity, Users } from 'lucide-react'

export default function Cta() {
  return (
    <section className="relative py-24 overflow-hidden w-full max-w-7xl mx-auto rounded-3xl mb-24">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Industrial machinery"
          fill
          className="object-cover brightness-[0.25]"
        />
      </div>
      <div className="absolute inset-0 bg-blue-900/50 mix-blend-overlay"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-blue-950/80 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-blue-600"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-md p-12 rounded-3xl border border-white/10 shadow-lg">
          <div className="inline-flex items-center px-4 py-1.5 bg-white/10 rounded-full mb-8 border border-white/20">
            <Star className="h-4 w-4 mr-2 fill-emerald-300 text-emerald-300" />
            <span className="text-white font-medium">LET'S TALK VERIFICATION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
            Your Project's Transparency Starts Here
          </h2>
          <p className="text-white text-xl text-emerald-300 font-semibold mb-8">— Gain Unwavering Confidence, One Project at a Time</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <Settings2 className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Reduce Uncertainty</h3>
              <p className="text-gray-300">Get real-time, verified updates on your project progress</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <Activity className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Optimize Investments</h3>
              <p className="text-gray-300">Ensure your funds are utilized effectively and transparently</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <Users className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Build Trust</h3>
              <p className="text-gray-300">Foster reliable relationships with local project managers</p>
            </div>
          </div>

          <p className="text-xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto">
            Whether you're looking to reduce uncertainty, optimize investments, or build trusted relationships, ProjectVerify is your trusted partner. Contact us today to get started!
          </p>
          
          <div className="flex justify-center">
            <Button asChild size="lg" className="relative bg-emerald-500 shadow-lg text-white hover:bg-emerald-600 rounded-xl font-bold group py-8 px-12 transition-all duration-300">
              <Link href="#contact" className="flex items-center">
                <span className="text-lg font-medium">Contact Us</span>
                <div className="ml-4 bg-white p-1.5 rounded-lg group-hover:-rotate-12 transition-transform duration-300">
                  <ArrowUpRight className="h-5 w-5 text-blue-700" />
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 
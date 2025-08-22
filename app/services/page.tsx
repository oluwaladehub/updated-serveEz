'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
    Camera,
    MapPin,
    CheckCircle,
    Bell,
    Check,
    ArrowRight
} from 'lucide-react'

export default function ServicesPage() {

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white relative overflow-x-hidden">
            <Header isLoggedIn={false} />

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
                <div className="text-center">
                    <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                        What We Offer
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                        Our Core{' '}
                        <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                            Services
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                        Comprehensive verification solutions designed specifically for diaspora investors seeking transparency and peace of mind.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                            Get Started Today
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Services Grid */}
            <section className="w-full max-w-7xl px-4 py-20 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                    {/* Service Card 1: Project Registration & Scope Definition */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm border border-white/20 hover:border-blue-300/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1591674278612-6b773b4a1ad7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Project Registration"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-white font-bold text-lg">Registration</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                                Project Registration & Scope Definition
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                We begin by thoroughly understanding your project requirements and establishing clear verification parameters.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Detailed project scope analysis</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Custom verification protocols</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Timeline and milestone planning</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Card 2: Independent On-Site Verification */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/30 backdrop-blur-sm border border-white/20 hover:border-emerald-300/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://plus.unsplash.com/premium_photo-1681992176015-ecb8dc8f2d47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8T24lMjBTaXRlfGVufDB8fDB8fHww"
                                alt="On-Site Verification"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-white font-bold text-lg">Verification</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-emerald-600 transition-colors">
                                Independent On-Site Verification
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Our trusted local agents conduct thorough site visits, gathering unbiased, factual evidence.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Professional site inspections</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Unbiased progress assessment</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Quality compliance verification</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Card 3: Secure Media & Reporting */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm border border-white/20 hover:border-purple-300/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>

                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1543286386-713bdd548da4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJlcG9ydGluZ3xlbnwwfHwwfHx8MA%3D%3D"
                                alt="Media & Reporting"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-white font-bold text-lg">Media</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 transition-colors">
                                Secure Media & Reporting
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Comprehensive documentation with high-quality photos, videos, and detailed reports.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">HD photos and videos</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Detailed progress reports</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Secure cloud storage</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Card 4: Continuous Progress Monitoring */}
                    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/30 dark:to-orange-950/30 backdrop-blur-sm border border-white/20 hover:border-yellow-300/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-600"></div>

                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Progress Monitoring"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg">
                                        <Bell className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-white font-bold text-lg">Monitoring</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 transition-colors">
                                Continuous Progress Monitoring
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Regular updates and milestone tracking to keep you informed throughout your project lifecycle.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Regular milestone updates</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Real-time notifications</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress analytics dashboard</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
'use client'

import Link from 'next/link'
import { Users, BookOpen, Check, Star, ArrowUpRight, Briefcase, Settings2, Activity } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-12 px-4 text-gray-600 dark:text-gray-400">
      <div className="col-span-full md:col-span-1 text-center md:text-left mb-6 md:mb-0">
        <Link href="/" className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300">
          ProjectVerify
        </Link>
        <p className="mt-4 text-sm">
          Transforming Reliability, Empowering Diaspora Investors.
        </p>
        <div className="flex justify-center md:justify-start mt-4 space-x-4">
          {/* Social Media Icons Placeholder */}
          <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
          <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
        </div>
      </div>

      <div className="text-center md:text-left">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Home</Link></li>
          <li><Link href="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Services</Link></li>
          <li><Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Features</Link></li>
          <li><Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Login</Link></li>
        </ul>
      </div>

      <div className="text-center md:text-left">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Services</h3>
        <ul className="space-y-2">
          <li><Link href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Project Registration</Link></li>
          <li><Link href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">On-Site Verification</Link></li>
          <li><Link href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Media & Reporting</Link></li>
          <li><Link href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Progress Monitoring</Link></li>
        </ul>
      </div>

      <div id="contact" className="text-center md:text-left">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Contact Us</h3>
        <ul className="space-y-2">
          <li><a href="tel:+2349065431332" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">+234 906 543 1332</a></li>
          <li><a href="https://wa.me/2349065431332" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">WhatsApp</a></li>
          <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Schedule a Meeting</a></li>
        </ul>
      </div>
    </footer>
  )
} 
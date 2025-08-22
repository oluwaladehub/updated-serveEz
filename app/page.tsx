'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Principles from '@/components/Principles'
import Cta from '@/components/Cta'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuthStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white relative overflow-x-hidden">
      <Header isLoggedIn={isLoggedIn} />
      <Hero />
      <Services />
      {/* <Principles /> */}
      <Cta />
      <Footer />
    </div>
  )
}

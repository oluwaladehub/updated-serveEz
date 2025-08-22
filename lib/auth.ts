import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'


export async function signOut() {
  const supabase = createBrowserClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function signUp(email: string, password: string, fullName: string, phone: string | null, country: string | null) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        country,
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

export async function resetPassword(email: string) {
  const supabase = createBrowserClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) {
    throw error
  }
}

export async function updatePassword(password: string) {
  const supabase = createBrowserClient()
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    throw error
  }
}

import { supabase } from '../config/supabase'
import type { NewsletterSignup, NewsletterSignupRequest } from '../types/Newsletter'

export class NewsletterService {
  
  async createSignup(signupData: NewsletterSignupRequest): Promise<NewsletterSignup> {
    try {
      const { error } = await supabase!
        .from('newsletter_signups')
        .insert([{
          email: signupData.email,
          interested_cities: signupData.interested_cities || ['Berlin'],
          signup_source: signupData.signup_source || 'unknown',
          preferences: signupData.preferences || {}
        }])

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('This email is already subscribed to our newsletter.')
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return {
        id: `newsletter-${Date.now()}`,
        email: signupData.email,
        interested_cities: signupData.interested_cities || ['Berlin'],
        signup_source: signupData.signup_source || 'unknown',
        preferences: signupData.preferences || {},
        confirmed_at: null,
        created_at: new Date().toISOString()
      } as NewsletterSignup
    } catch (error) {
      console.error('Error creating newsletter signup:', error)
      throw error
    }
  }

  async getAllSignups(): Promise<NewsletterSignup[]> {
    try {
      const { data, error } = await supabase!
        .from('newsletter_signups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching newsletter signups:', error)
      throw error
    }
  }

  async getAllSubscriptions(): Promise<NewsletterSignup[]> {
    return this.getAllSignups()
  }

  async deleteSubscription(id: string): Promise<void> {
    try {
      const { error } = await supabase!
        .from('newsletter_signups')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting subscription:', error)
      throw error
    }
  }

}
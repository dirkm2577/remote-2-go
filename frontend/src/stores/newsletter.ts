import { defineStore } from 'pinia'
import { ref } from 'vue'

interface NewsletterSignup {
  id: string
  email: string
  interested_cities: string[]
  signup_source?: string
  preferences?: Record<string, any>
  confirmed_at?: string | null
  created_at: string
}

interface NewsletterSignupRequest {
  email: string
  interested_cities?: string[]
  signup_source?: string
  preferences?: Record<string, any>
}

export const useNewsletterStore = defineStore('newsletter', () => {
  const API_BASE_URL = 'http://localhost:3001/api'
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastSignup = ref<NewsletterSignup | null>(null)

  const signup = async (signupData: NewsletterSignupRequest): Promise<NewsletterSignup> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe to newsletter')
      }

      lastSignup.value = result.data
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe to newsletter'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading,
    error,
    lastSignup,
    signup,
    clearError
  }
})
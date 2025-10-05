import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface AdminStats {
  totalPlaces: number
  pendingPlaces: number
  totalSubmissions: number
  totalSubscribers: number
  totalFeedback: number
  newFeedback: number
}

interface Place {
  id: string
  name: string
  address: string
  status: 'active' | 'pending' | 'archived'
  verified: boolean
  created_at: string
  [key: string]: any
}

interface NewsletterSubscription {
  id: string
  email: string
  interested_cities: string[]
  signup_source: string
  created_at: string
  [key: string]: any
}

interface Feedback {
  id: string
  feedback_type: 'suggestion' | 'bug_report' | 'general'
  message: string
  contact_email?: string
  status: 'new' | 'in_progress' | 'resolved'
  created_at: string
  [key: string]: any
}

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const stats = ref<AdminStats | null>(null)
  const places = ref<Place[]>([])
  const submissions = ref<Place[]>([])
  const subscriptions = ref<NewsletterSubscription[]>([])
  const feedback = ref<Feedback[]>([])

  const login = async (password: string): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await fetch(`${API_BASE}/api/admin/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        token.value = data.token
        isAuthenticated.value = true
        localStorage.setItem('admin_token', data.token)
        return true
      } else {
        error.value = data.message || 'Authentication failed'
        return false
      }
    } catch (err) {
      console.error('Admin login error:', err)
      error.value = 'Network error. Please try again.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    token.value = null
    localStorage.removeItem('admin_token')
    stats.value = null
    places.value = []
    submissions.value = []
    subscriptions.value = []
    feedback.value = []
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      token.value = savedToken
      isAuthenticated.value = true
    }
  }

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${token.value}`,
    'Content-Type': 'application/json',
  })

  const fetchStats = async (): Promise<void> => {
    if (!isAuthenticated.value) return

    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        stats.value = await response.json()
      } else if (response.status === 401) {
        logout()
      } else {
        error.value = 'Failed to fetch statistics'
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
      error.value = 'Network error'
    } finally {
      isLoading.value = false
    }
  }

  const fetchPlaces = async (): Promise<void> => {
    if (!isAuthenticated.value) return

    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/api/admin/places`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        places.value = await response.json()
      } else if (response.status === 401) {
        logout()
      } else {
        error.value = 'Failed to fetch places'
      }
    } catch (err) {
      console.error('Error fetching places:', err)
      error.value = 'Network error'
    } finally {
      isLoading.value = false
    }
  }

  const fetchSubmissions = async (): Promise<void> => {
    if (!isAuthenticated.value) return

    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/api/admin/place-submissions`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        submissions.value = await response.json()
      } else if (response.status === 401) {
        logout()
      } else {
        error.value = 'Failed to fetch submissions'
      }
    } catch (err) {
      console.error('Error fetching submissions:', err)
      error.value = 'Network error'
    } finally {
      isLoading.value = false
    }
  }

  const updateSubmissionStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
    if (!isAuthenticated.value) return false

    try {
      const response = await fetch(`${API_BASE}/api/admin/place-submissions/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchSubmissions() // Refresh the submissions list
        await fetchPlaces() // Refresh places (in case something was approved)
        await fetchStats() // Refresh stats
        return true
      } else if (response.status === 401) {
        logout()
        return false
      } else {
        error.value = 'Failed to update submission status'
        return false
      }
    } catch (err) {
      console.error('Error updating submission status:', err)
      error.value = 'Network error'
      return false
    }
  }

  const fetchSubscriptions = async (): Promise<void> => {
    if (!isAuthenticated.value) return

    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/api/admin/newsletters`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        subscriptions.value = await response.json()
      } else if (response.status === 401) {
        logout()
      } else {
        error.value = 'Failed to fetch subscriptions'
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err)
      error.value = 'Network error'
    } finally {
      isLoading.value = false
    }
  }

  const deleteSubscription = async (id: string): Promise<boolean> => {
    if (!isAuthenticated.value) return false

    try {
      const response = await fetch(`${API_BASE}/api/admin/newsletters/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        await fetchSubscriptions() // Refresh the list
        await fetchStats() // Refresh stats
        return true
      } else if (response.status === 401) {
        logout()
        return false
      } else {
        error.value = 'Failed to delete subscription'
        return false
      }
    } catch (err) {
      console.error('Error deleting subscription:', err)
      error.value = 'Network error'
      return false
    }
  }

  const fetchFeedback = async (): Promise<void> => {
    if (!isAuthenticated.value) return

    try {
      isLoading.value = true
      const response = await fetch(`${API_BASE}/api/admin/feedback`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        feedback.value = await response.json()
      } else if (response.status === 401) {
        logout()
      } else {
        error.value = 'Failed to fetch feedback'
      }
    } catch (err) {
      console.error('Error fetching feedback:', err)
      error.value = 'Network error'
    } finally {
      isLoading.value = false
    }
  }

  const updateFeedbackStatus = async (id: string, status: 'new' | 'in_progress' | 'resolved'): Promise<boolean> => {
    if (!isAuthenticated.value) return false

    try {
      const response = await fetch(`${API_BASE}/api/admin/feedback/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchFeedback() // Refresh the list
        await fetchStats() // Refresh stats
        return true
      } else if (response.status === 401) {
        logout()
        return false
      } else {
        error.value = 'Failed to update feedback status'
        return false
      }
    } catch (err) {
      console.error('Error updating feedback status:', err)
      error.value = 'Network error'
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    stats,
    places,
    submissions,
    subscriptions,
    feedback,
    
    // Actions
    login,
    logout,
    initializeAuth,
    fetchStats,
    fetchPlaces,
    fetchSubmissions,
    updateSubmissionStatus,
    fetchSubscriptions,
    deleteSubscription,
    fetchFeedback,
    updateFeedbackStatus,
    clearError,
  }
})
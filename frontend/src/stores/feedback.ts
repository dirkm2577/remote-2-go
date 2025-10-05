import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserFeedback {
  id: string
  feedback_type: 'suggestion' | 'bug_report' | 'general'
  message: string
  contact_email?: string
  related_place_id?: string
  status: 'new' | 'in_progress' | 'resolved'
  created_at: string
}

interface FeedbackRequest {
  feedback_type: 'suggestion' | 'bug_report' | 'general'
  message: string
  contact_email?: string
  related_place_id?: string
}

export const useFeedbackStore = defineStore('feedback', () => {
  const API_BASE_URL = 'http://localhost:3001/api'
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastSubmission = ref<UserFeedback | null>(null)

  const submitFeedback = async (feedbackData: FeedbackRequest): Promise<UserFeedback> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit feedback')
      }

      lastSubmission.value = result.data
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  const getAllFeedback = async (): Promise<UserFeedback[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch feedback')
      }

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch feedback'
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
    lastSubmission,
    submitFeedback,
    getAllFeedback,
    clearError
  }
})
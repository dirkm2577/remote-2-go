<template>
  <div class="feedback-form bg-white rounded-xl shadow-sm p-6">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2">
        Send Feedback
      </h3>
      <p class="text-gray-600 text-sm">
        Help us improve Remote2Go by sharing your suggestions, reporting issues, or just letting us know how we're doing.
      </p>
    </div>

    <!-- Success State -->
    <div v-if="showSuccess" class="text-center py-8">
      <div class="text-green-600 text-4xl mb-4">✅</div>
      <h4 class="text-lg font-semibold text-green-800 mb-2">
        Thank you for your feedback!
      </h4>
      <p class="text-green-700 text-sm mb-4">
        We appreciate you taking the time to help us improve Remote2Go.
      </p>
      <button
        @click="resetForm"
        class="btn btn-secondary"
      >
        Send More Feedback
      </button>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Feedback Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          What type of feedback is this? *
        </label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label 
            v-for="type in feedbackTypes" 
            :key="type.value"
            class="relative flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            :class="{ 'border-primary-500 bg-primary-50': formData.feedback_type === type.value }"
          >
            <input
              type="radio"
              :value="type.value"
              v-model="formData.feedback_type"
              class="sr-only"
              :disabled="feedbackStore.isLoading"
            />
            <div class="flex items-center">
              <div class="text-lg mr-3">{{ type.emoji }}</div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ type.label }}</div>
                <div class="text-xs text-gray-500">{{ type.description }}</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Message -->
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
          Your message *
        </label>
        <textarea
          id="message"
          v-model="formData.message"
          rows="4"
          placeholder="Tell us what's on your mind..."
          required
          minlength="10"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
          :disabled="feedbackStore.isLoading"
        ></textarea>
        <div class="text-xs text-gray-500 mt-1">
          Minimum 10 characters ({{ formData.message.length }}/10)
        </div>
      </div>

      <!-- Contact Email (Optional) -->
      <div>
        <label for="contact_email" class="block text-sm font-medium text-gray-700 mb-2">
          Your email (optional)
        </label>
        <input
          id="contact_email"
          v-model="formData.contact_email"
          type="email"
          placeholder="your@email.com"
          autocomplete="email"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          :disabled="feedbackStore.isLoading"
        />
        <div class="text-xs text-gray-500 mt-1">
          We'll only use this to follow up on your feedback if needed.
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="feedbackStore.error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
        {{ feedbackStore.error }}
      </div>

      <!-- Submit Button -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="feedbackStore.isLoading || !isFormValid"
          class="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="feedbackStore.isLoading">Sending...</span>
          <span v-else>Send Feedback</span>
        </button>
        
        <button
          v-if="onCancel"
          type="button"
          @click="onCancel"
          class="btn btn-secondary"
          :disabled="feedbackStore.isLoading"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useFeedbackStore } from '../stores/feedback'

interface Props {
  onCancel?: () => void
  relatedPlaceId?: string
}

const props = defineProps<Props>()

const feedbackStore = useFeedbackStore()
const showSuccess = ref(false)

const feedbackTypes = [
  {
    value: 'suggestion' as const,
    label: 'Suggestion',
    description: 'Ideas for improvement',
    emoji: '💡'
  },
  {
    value: 'bug_report' as const,
    label: 'Bug Report',
    description: 'Something is broken',
    emoji: '🐛'
  },
  {
    value: 'general' as const,
    label: 'General',
    description: 'Other feedback',
    emoji: '💬'
  }
]

const formData = reactive({
  feedback_type: '' as 'suggestion' | 'bug_report' | 'general' | '',
  message: '',
  contact_email: ''
})

const isFormValid = computed(() => {
  return formData.feedback_type && 
         formData.message.trim().length >= 10
})

const handleSubmit = async () => {
  try {
    feedbackStore.clearError()
    
    await feedbackStore.submitFeedback({
      feedback_type: formData.feedback_type as 'suggestion' | 'bug_report' | 'general',
      message: formData.message.trim(),
      contact_email: formData.contact_email.trim() || undefined,
      related_place_id: props.relatedPlaceId || undefined
    })

    showSuccess.value = true
    
  } catch (error) {
    // Error is handled by the store
    console.error('Feedback submission failed:', error)
  }
}

const resetForm = () => {
  showSuccess.value = false
  formData.feedback_type = ''
  formData.message = ''
  formData.contact_email = ''
  feedbackStore.clearError()
}
</script>
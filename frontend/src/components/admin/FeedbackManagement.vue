<template>
  <div>
    <div v-if="adminStore.feedback.length === 0" class="text-center text-gray-500 py-8">
      No feedback submissions found.
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="feedback in adminStore.feedback"
        :key="feedback.id"
        class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <span class="text-lg">{{ getFeedbackTypeEmoji(feedback.feedback_type) }}</span>
              <h4 class="font-semibold text-gray-900 capitalize">{{ feedback.feedback_type.replace('_', ' ') }}</h4>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusColor(feedback.status)
                ]"
              >
                {{ getStatusLabel(feedback.status) }}
              </span>
            </div>
            
            <p class="text-gray-700 mb-3">{{ feedback.message }}</p>
            
            <div class="text-sm text-gray-600 mb-2">
              <div v-if="feedback.contact_email">
                <strong>Contact:</strong> {{ feedback.contact_email }}
              </div>
              <div v-if="feedback.related_place_id">
                <strong>Related Place:</strong> {{ feedback.related_place_id }}
              </div>
            </div>
            
            <div class="text-xs text-gray-500">
              Submitted: {{ formatDate(feedback.created_at) }}
            </div>
          </div>
          
          <div class="ml-4 flex flex-col space-y-2">
            <select
              :value="feedback.status"
              @change="updateStatus(feedback.id, ($event.target as HTMLSelectElement).value as any)"
              :disabled="adminStore.isLoading"
              class="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '../../stores/admin'

const adminStore = useAdminStore()

const getFeedbackTypeEmoji = (type: string) => {
  switch (type) {
    case 'suggestion':
      return '💡'
    case 'bug_report':
      return '🐛'
    case 'general':
      return '💬'
    default:
      return '📝'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-red-100 text-red-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'new':
      return 'New'
    case 'in_progress':
      return 'In Progress'
    case 'resolved':
      return 'Resolved'
    default:
      return status
  }
}

const updateStatus = async (id: string, status: 'new' | 'in_progress' | 'resolved') => {
  await adminStore.updateFeedbackStatus(id, status)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
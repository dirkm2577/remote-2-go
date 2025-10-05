<template>
  <div>
    <div v-if="adminStore.submissions.length === 0" class="text-center text-gray-500 py-8">
      No place submissions found.
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="submission in adminStore.submissions"
        :key="submission.id"
        class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h4 class="font-semibold text-gray-900">{{ submission.name }}</h4>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusColor(submission.status)
                ]"
              >
                {{ getStatusLabel(submission.status) }}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-2">{{ submission.address }}</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
              <div>WiFi: {{ submission.wifi_quality || 'Not specified' }}</div>
              <div>Noise: {{ submission.noise_level || 'Not specified' }}</div>
              <div>Power: {{ submission.power_outlets ? 'Available' : 'Not available' }}</div>
              <div>Price: {{ submission.price_level || 'Not specified' }}</div>
            </div>
            
            <p v-if="submission.description" class="text-gray-700 text-sm mb-3">
              {{ submission.description }}
            </p>

            <div class="text-xs text-gray-500 mb-2">
              <div v-if="submission.submitter_email">
                <strong>Submitter:</strong> {{ submission.submitter_email }}
              </div>
              <div v-if="submission.submitter_name">
                <strong>Name:</strong> {{ submission.submitter_name }}
              </div>
            </div>
            
            <div class="text-xs text-gray-500">
              Submitted: {{ formatDate(submission.created_at) }}
            </div>
          </div>
          
          <div class="ml-4 flex flex-col space-y-2">
            <select
              :value="submission.status"
              @change="updateStatus(submission.id, ($event.target as HTMLSelectElement).value as any)"
              :disabled="adminStore.isLoading"
              class="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Approved'
    case 'pending':
      return 'Pending'
    case 'rejected':
      return 'Rejected'
    default:
      return status
  }
}

const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
  await adminStore.updateSubmissionStatus(id, status)
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
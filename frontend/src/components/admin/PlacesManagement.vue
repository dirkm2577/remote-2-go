<template>
  <div>
    <div v-if="adminStore.places.length === 0" class="text-center text-gray-500 py-8">
      No approved places found.
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="place in adminStore.places"
        :key="place.id"
        class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h4 class="font-semibold text-gray-900">{{ place.name }}</h4>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusColor(place.status)
                ]"
              >
                {{ getStatusLabel(place.status) }}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-2">{{ place.address }}</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
              <div>WiFi: {{ place.wifi_quality || 'Not specified' }}</div>
              <div>Noise: {{ place.noise_level || 'Not specified' }}</div>
              <div>Power: {{ place.power_outlets ? 'Available' : 'Not available' }}</div>
              <div>Price: {{ place.price_level || 'Not specified' }}</div>
            </div>
            
            <p v-if="place.description" class="text-gray-700 text-sm mb-3">
              {{ place.description }}
            </p>
            
            <div class="text-xs text-gray-500">
              Submitted: {{ formatDate(place.created_at) }}
            </div>
          </div>
          
          <!-- Read-only view for approved places -->
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
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'archived':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Approved'
    case 'pending':
      return 'Pending'
    case 'archived':
      return 'Rejected'
    default:
      return status
  }
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
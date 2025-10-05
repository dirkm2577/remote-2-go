<template>
  <div>
    <div v-if="adminStore.subscriptions.length === 0" class="text-center text-gray-500 py-8">
      No newsletter subscriptions found.
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="subscription in adminStore.subscriptions"
        :key="subscription.id"
        class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <span class="font-medium text-gray-900">{{ subscription.email }}</span>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  subscription.confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ subscription.confirmed_at ? 'Confirmed' : 'Pending' }}
              </span>
            </div>
            
            <div class="text-sm text-gray-600 mb-2">
              <strong>Cities:</strong> {{ subscription.interested_cities.join(', ') }}
            </div>
            
            <div class="text-sm text-gray-600 mb-2">
              <strong>Source:</strong> {{ subscription.signup_source || 'Unknown' }}
            </div>
            
            <div class="text-xs text-gray-500">
              Signed up: {{ formatDate(subscription.created_at) }}
              <span v-if="subscription.confirmed_at">
                • Confirmed: {{ formatDate(subscription.confirmed_at) }}
              </span>
            </div>
          </div>
          
          <div class="ml-4">
            <button
              @click="deleteSubscription(subscription.id, subscription.email)"
              :disabled="adminStore.isLoading"
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Confirm Deletion
        </h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete the subscription for <strong>{{ emailToDelete }}</strong>? This action cannot be undone.
        </p>
        <div class="flex space-x-3">
          <button
            @click="confirmDelete"
            :disabled="adminStore.isLoading"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Delete
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '../../stores/admin'

const adminStore = useAdminStore()

const showDeleteModal = ref(false)
const emailToDelete = ref('')
const idToDelete = ref('')

const deleteSubscription = (id: string, email: string) => {
  idToDelete.value = id
  emailToDelete.value = email
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  await adminStore.deleteSubscription(idToDelete.value)
  showDeleteModal.value = false
  idToDelete.value = ''
  emailToDelete.value = ''
}

const cancelDelete = () => {
  showDeleteModal.value = false
  idToDelete.value = ''
  emailToDelete.value = ''
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
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

            <p class="text-gray-600 text-sm mb-2">{{ place.address }}, {{ place.city }}</p>

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

          <!-- Edit button -->
          <button
            @click="openEditModal(place)"
            class="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeEditModal"
    >
      <div
        class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Edit Place</h3>
            <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="savePlace" class="space-y-4">
            <!-- Basic Info -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="editForm.name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                v-model="editForm.address"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                v-model="editForm.city"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="editForm.description"
                rows="3"
                class="w-full border border-gray-300 rounded px-3 py-2"
              ></textarea>
            </div>

            <!-- Attributes -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">WiFi Quality</label>
                <select v-model="editForm.wifi_quality" class="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Noise Level</label>
                <select v-model="editForm.noise_level" class="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="quiet">Quiet</option>
                  <option value="moderate">Moderate</option>
                  <option value="noisy">Noisy</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price Level</label>
                <select v-model="editForm.price_level" class="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="free">Free</option>
                  <option value="low">Low (€)</option>
                  <option value="medium">Medium (€€)</option>
                  <option value="high">High (€€€)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
                <select v-model="editForm.visit_type" class="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="quick_stop">Quick Stop</option>
                  <option value="day_visit">Day Visit</option>
                  <option value="multi_day">Multi Day</option>
                </select>
              </div>
            </div>

            <div class="flex items-center">
              <input
                v-model="editForm.power_outlets"
                type="checkbox"
                class="mr-2"
              />
              <label class="text-sm font-medium text-gray-700">Power Outlets Available</label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes, leave empty if none)</label>
              <input
                v-model.number="editForm.time_limit"
                type="number"
                min="0"
                class="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <!-- Opening Hours -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
              <div class="space-y-2 text-sm">
                <div v-for="day in daysOfWeek" :key="day" class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    :checked="editForm.opening_hours?.[day]?.isOpen"
                    @change="toggleDay(day, $event)"
                    class="mr-2"
                  />
                  <span class="w-24 capitalize">{{ day }}</span>
                  <template v-if="editForm.opening_hours?.[day]?.isOpen">
                    <input
                      v-model="editForm.opening_hours[day].openTime"
                      type="time"
                      class="border border-gray-300 rounded px-2 py-1"
                    />
                    <span>to</span>
                    <input
                      v-model="editForm.opening_hours[day].closeTime"
                      type="time"
                      class="border border-gray-300 rounded px-2 py-1"
                    />
                  </template>
                  <span v-else class="text-gray-400">Closed</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '../../stores/admin'

const adminStore = useAdminStore()

const showEditModal = ref(false)
const isSaving = ref(false)
const editingPlace = ref<any>(null)
const editForm = ref<any>({})

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

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

const initializeOpeningHours = () => {
  const hours: any = {}
  daysOfWeek.forEach(day => {
    hours[day] = {
      isOpen: false,
      openTime: '09:00',
      closeTime: '17:00'
    }
  })
  return hours
}

const openEditModal = (place: any) => {
  editingPlace.value = place

  // Deep clone the place data to avoid mutating the original
  editForm.value = {
    name: place.name,
    address: place.address,
    city: place.city,
    description: place.description || '',
    wifi_quality: place.wifi_quality,
    noise_level: place.noise_level,
    price_level: place.price_level,
    visit_type: place.visit_type,
    power_outlets: place.power_outlets || false,
    time_limit: place.time_limit || null,
    opening_hours: place.opening_hours ? JSON.parse(JSON.stringify(place.opening_hours)) : initializeOpeningHours()
  }

  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingPlace.value = null
  editForm.value = {}
}

const toggleDay = (day: string, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  if (!editForm.value.opening_hours) {
    editForm.value.opening_hours = initializeOpeningHours()
  }
  editForm.value.opening_hours[day].isOpen = isChecked
}

const savePlace = async () => {
  if (!editingPlace.value) return

  isSaving.value = true

  try {
    // Prepare the data to send
    const updateData = {
      name: editForm.value.name,
      address: editForm.value.address,
      city: editForm.value.city,
      description: editForm.value.description,
      wifi_quality: editForm.value.wifi_quality,
      noise_level: editForm.value.noise_level,
      price_level: editForm.value.price_level,
      visit_type: editForm.value.visit_type,
      power_outlets: editForm.value.power_outlets,
      time_limit: editForm.value.time_limit || null,
      opening_hours: editForm.value.opening_hours,
      hours_last_verified_at: new Date().toISOString()
    }

    const success = await adminStore.updatePlace(editingPlace.value.id, updateData)

    if (success) {
      closeEditModal()
    } else {
      alert('Failed to update place. Please try again.')
    }
  } catch (error) {
    console.error('Error saving place:', error)
    alert('An error occurred while saving. Please try again.')
  } finally {
    isSaving.value = false
  }
}
</script>
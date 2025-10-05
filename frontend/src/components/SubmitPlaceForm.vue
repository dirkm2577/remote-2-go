<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Submit a New Place</h2>
      <p class="text-gray-600">Help the community by adding a great work-friendly place!</p>
      
      <!-- Progress Indicator -->
      <div class="mt-6">
        <div class="flex items-center">
          <div class="flex items-center text-sm">
            <div :class="currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'" 
                 class="w-8 h-8 rounded-full flex items-center justify-center font-medium">
              1
            </div>
            <span class="ml-2 text-gray-900">Basic Info</span>
          </div>
          <div class="flex-1 h-0.5 mx-4 bg-gray-300">
            <div :class="currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'" 
                 class="h-full transition-colors duration-300"></div>
          </div>
          <div class="flex items-center text-sm">
            <div :class="currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'" 
                 class="w-8 h-8 rounded-full flex items-center justify-center font-medium">
              2
            </div>
            <span class="ml-2 text-gray-900">Work Details</span>
          </div>
          <div class="flex-1 h-0.5 mx-4 bg-gray-300">
            <div :class="currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'" 
                 class="h-full transition-colors duration-300"></div>
          </div>
          <div class="flex items-center text-sm">
            <div :class="currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'" 
                 class="w-8 h-8 rounded-full flex items-center justify-center font-medium">
              3
            </div>
            <span class="ml-2 text-gray-900">Review</span>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6" autocomplete="off">
      <!-- Step 1: Basic Information -->
      <div v-show="currentStep === 1" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Place Name *
          </label>
          <input
            v-model="formData.name"
            type="text"
            id="name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Café Central"
          />
        </div>

        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            v-model="formData.address"
            type="text"
            id="address"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Hackescher Markt 2, 10178 Berlin"
          />
        </div>

        <div>
          <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            v-model="formData.city"
            type="text"
            id="city"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Berlin"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="formData.description"
            id="description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe what makes this place great for remote work..."
          ></textarea>
        </div>
      </div>

      <!-- Step 2: Work Details -->
      <div v-show="currentStep === 2" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Visit Type *</label>
          <div class="space-y-2">
            <label v-for="option in visitTypeOptions" :key="option.value" class="flex items-center">
              <input
                v-model="formData.visit_type"
                type="radio"
                :value="option.value"
                class="mr-3 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-sm">{{ option.label }}</span>
              <span class="text-xs text-gray-500 ml-2">{{ option.description }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">WiFi Quality *</label>
          <select
            v-model="formData.wifi_quality"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select WiFi quality</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Noise Level *</label>
          <select
            v-model="formData.noise_level"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select noise level</option>
            <option value="quiet">Quiet</option>
            <option value="moderate">Moderate</option>
            <option value="noisy">Noisy</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Price Level *</label>
          <select
            v-model="formData.price_level"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select price level</option>
            <option value="free">Free</option>
            <option value="low">Low (€)</option>
            <option value="medium">Medium (€€)</option>
            <option value="high">High (€€€)</option>
          </select>
        </div>

        <div>
          <label class="flex items-center">
            <input
              v-model="formData.power_outlets"
              type="checkbox"
              class="mr-3 text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-sm font-medium text-gray-700">Power outlets available</span>
          </label>
        </div>

        <div>
          <label for="time_limit" class="block text-sm font-medium text-gray-700 mb-2">
            Time Limit (minutes)
          </label>
          <input
            v-model.number="formData.time_limit"
            type="number"
            id="time_limit"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Leave empty for no time limit"
          />
          <p class="text-xs text-gray-500 mt-1">Leave empty if there's no time limit</p>
        </div>

        <div>
          <label for="amenities" class="block text-sm font-medium text-gray-700 mb-2">
            Amenities (comma-separated)
          </label>
          <input
            v-model="amenitiesInput"
            type="text"
            id="amenities"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., coffee, food, outdoor_seating"
          />
        </div>
      </div>

      <!-- Step 3: Review -->
      <div v-show="currentStep === 3" class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Review Your Submission</h3>
          <div class="bg-gray-50 p-4 rounded-md space-y-3">
            <div><strong>Name:</strong> {{ formData.name }}</div>
            <div><strong>Address:</strong> {{ formData.address }}</div>
            <div><strong>City:</strong> {{ formData.city }}</div>
            <div><strong>Visit Type:</strong> {{ getVisitTypeLabel(formData.visit_type) }}</div>
            <div><strong>WiFi Quality:</strong> {{ formData.wifi_quality }}</div>
            <div><strong>Noise Level:</strong> {{ formData.noise_level }}</div>
            <div><strong>Price Level:</strong> {{ formData.price_level }}</div>
            <div><strong>Power Outlets:</strong> {{ formData.power_outlets ? 'Yes' : 'No' }}</div>
            <div v-if="formData.time_limit"><strong>Time Limit:</strong> {{ formData.time_limit }} minutes</div>
            <div v-if="formData.description"><strong>Description:</strong> {{ formData.description }}</div>
            <div v-if="amenitiesArray.length"><strong>Amenities:</strong> {{ amenitiesArray.join(', ') }}</div>
          </div>
        </div>

        <div>
          <label for="submitter_name" class="block text-sm font-medium text-gray-700 mb-2">
            Your Name (optional)
          </label>
          <input
            v-model="formData.submitter_name"
            type="text"
            id="submitter_name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label for="submitter_email" class="block text-sm font-medium text-gray-700 mb-2">
            Your Email (optional)
          </label>
          <input
            v-model="formData.submitter_email"
            type="email"
            id="submitter_email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="your@email.com"
          />
          <p class="text-xs text-gray-500 mt-1">We'll contact you if we need more information</p>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between pt-6 border-t border-gray-200">
        <button
          v-if="currentStep > 1"
          type="button"
          @click="currentStep--"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Previous
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < 3"
          type="button"
          @click="nextStep"
          :disabled="!canProceed"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          v-else
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Submitting...' : 'Submit Place' }}
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div v-if="submitted" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800">
            Submission Successful!
          </h3>
          <div class="mt-2 text-sm text-green-700">
            <p>Thank you for your submission! We'll review it and add it to our directory if it meets our criteria.</p>
          </div>
          <div class="mt-4">
            <button
              @click="goToHome"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Submission Failed
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PlaceSubmission } from '../types/Place'

const router = useRouter()
const currentStep = ref(1)
const loading = ref(false)
const submitted = ref(false)
const error = ref<string | null>(null)
const amenitiesInput = ref('')

const formData = ref<Partial<PlaceSubmission>>({
  name: '',
  address: '',
  city: '',
  description: '',
  visit_type: '',
  wifi_quality: '',
  noise_level: '',
  price_level: '',
  power_outlets: false,
  time_limit: null,
  submitter_name: '',
  submitter_email: '',
  submission_source: 'web_form'
})

const visitTypeOptions = [
  { 
    value: 'quick_stop', 
    label: 'Quick Stop', 
    description: '1-3 hours' 
  },
  { 
    value: 'day_visit', 
    label: 'Day Visit', 
    description: '4-8 hours' 
  },
  { 
    value: 'multi_day', 
    label: 'Multi-Day Stay', 
    description: 'Extended work sessions' 
  }
]

const amenitiesArray = computed(() => {
  return amenitiesInput.value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
})

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return formData.value.name && formData.value.address && formData.value.city
  }
  if (currentStep.value === 2) {
    return formData.value.visit_type && formData.value.wifi_quality && 
           formData.value.noise_level && formData.value.price_level
  }
  return true
})

const getVisitTypeLabel = (value: string) => {
  const option = visitTypeOptions.find(opt => opt.value === value)
  return option ? option.label : value
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < 3) {
    currentStep.value++
  }
}

const goToHome = () => {
  router.push('/')
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    const submissionData = {
      ...formData.value,
      amenities: amenitiesArray.value.length > 0 ? amenitiesArray.value : null,
      time_limit: formData.value.time_limit || null
    }

    const response = await fetch('http://localhost:3001/api/place-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    })

    if (!response.ok) {
      throw new Error('Failed to submit place')
    }

    submitted.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to submit place'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  currentStep.value = 1
  submitted.value = false
  error.value = null
  amenitiesInput.value = ''
  formData.value = {
    name: '',
    address: '',
    city: '',
    description: '',
    visit_type: '',
    wifi_quality: '',
    noise_level: '',
    price_level: '',
    power_outlets: false,
    time_limit: null,
    submitter_name: '',
    submitter_email: '',
    submission_source: 'web_form'
  }
}
</script>
<template>
  <div class="newsletter-signup bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 md:p-8">
    <div class="max-w-md mx-auto text-center">
      <!-- Header -->
      <div class="mb-6">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">
          Stay Updated
        </h3>
        <p class="text-gray-600">
          Get notified when we add new work-friendly places in Berlin and other cities.
        </p>
      </div>

      <!-- Success State -->
      <div v-if="showSuccess" class="text-center">
        <div class="text-green-600 text-4xl mb-4">✅</div>
        <h4 class="text-lg font-semibold text-green-800 mb-2">
          Thanks for subscribing!
        </h4>
        <p class="text-green-700 text-sm">
          We'll keep you updated on new places in {{ formData.interested_cities.join(', ') }}.
        </p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email Input -->
        <div>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Enter your email address"
            required
            autocomplete="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :disabled="newsletterStore.isLoading"
          />
        </div>

        <!-- City Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Interested in (optional):
          </label>
          <div class="flex flex-wrap gap-2">
            <label 
              v-for="city in availableCities" 
              :key="city"
              class="inline-flex items-center"
            >
              <input
                type="checkbox"
                :value="city"
                v-model="formData.interested_cities"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                :disabled="newsletterStore.isLoading"
              />
              <span class="ml-2 text-sm text-gray-700">{{ city }}</span>
            </label>
          </div>
        </div>

        <!-- GDPR Consent -->
        <div class="text-left">
          <label class="inline-flex items-start">
            <input
              v-model="formData.gdprConsent"
              type="checkbox"
              required
              class="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              :disabled="newsletterStore.isLoading"
            />
            <span class="ml-2 text-xs text-gray-600">
              I agree to receive email updates about new work-friendly places. 
              You can unsubscribe at any time.
            </span>
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="newsletterStore.error" class="text-red-600 text-sm text-center">
          {{ newsletterStore.error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="newsletterStore.isLoading || !formData.gdprConsent"
          class="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="newsletterStore.isLoading">Subscribing...</span>
          <span v-else>Subscribe to Updates</span>
        </button>
      </form>

      <!-- Privacy Note -->
      <p v-if="!showSuccess" class="text-xs text-gray-500 mt-4">
        We respect your privacy. No spam, just useful updates.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNewsletterStore } from '@/stores/newsletter'

interface Props {
  signupSource?: string
  defaultCities?: string[]
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  signupSource: 'unknown',
  defaultCities: () => ['Berlin'],
  compact: false
})

const newsletterStore = useNewsletterStore()
const showSuccess = ref(false)

const availableCities = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne']

const formData = reactive({
  email: '',
  interested_cities: [...props.defaultCities],
  gdprConsent: false
})

const handleSubmit = async () => {
  try {
    newsletterStore.clearError()
    
    await newsletterStore.signup({
      email: formData.email,
      interested_cities: formData.interested_cities.length > 0 ? formData.interested_cities : ['Berlin'],
      signup_source: props.signupSource,
      preferences: {
        gdpr_consent: true,
        consent_date: new Date().toISOString()
      }
    })

    showSuccess.value = true
    
    // Reset form after success
    setTimeout(() => {
      showSuccess.value = false
      formData.email = ''
      formData.interested_cities = [...props.defaultCities]
      formData.gdprConsent = false
    }, 5000)
    
  } catch (error) {
    // Error is handled by the store
    console.error('Newsletter signup failed:', error)
  }
}
</script>
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            Remote2Go
          </router-link>
          <div class="flex items-center space-x-4">
            <router-link to="/places" class="text-gray-600 hover:text-gray-900">
              Places
            </router-link>
            <router-link to="/submit" class="text-gray-600 hover:text-gray-900">
              Submit Place
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            We'd Love Your Feedback
          </h1>
          <p class="text-lg text-gray-600">
            Help us make Remote2Go better for everyone. Your feedback drives our improvements and helps us build features that matter to you.
          </p>
        </div>

        <FeedbackForm />
        
        <!-- Additional Info -->
        <div class="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">
            What happens to your feedback?
          </h3>
          <div class="space-y-2 text-sm text-blue-800">
            <div class="flex items-start">
              <div class="text-blue-600 mr-2">•</div>
              <div>We read every piece of feedback personally</div>
            </div>
            <div class="flex items-start">
              <div class="text-blue-600 mr-2">•</div>
              <div>Suggestions help us prioritize new features</div>
            </div>
            <div class="flex items-start">
              <div class="text-blue-600 mr-2">•</div>
              <div>Bug reports help us fix issues quickly</div>
            </div>
            <div class="flex items-start">
              <div class="text-blue-600 mr-2">•</div>
              <div>If you provide your email, we may follow up for clarification</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import FeedbackForm from '../components/FeedbackForm.vue'
</script>
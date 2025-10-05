<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
    <main class="container mx-auto px-4 py-16">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Find Your Perfect
          <span class="text-primary-600">Work Spot</span>
        </h1>
        
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover work-friendly places in Berlin with reliable WiFi, power outlets, and the perfect atmosphere for productivity.
        </p>
        
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <router-link
            to="/places"
            class="btn btn-primary text-lg px-8 py-4 inline-block w-full sm:w-auto"
          >
            Find Places Now
          </router-link>
          <router-link
            to="/submit"
            class="btn bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 inline-block w-full sm:w-auto"
          >
            Submit a Place
          </router-link>
        </div>
        
        <div class="mt-6 text-center space-y-2">
          <div>
            <router-link
              to="/feedback"
              class="text-primary-600 hover:text-primary-700 font-medium"
            >
              Send Feedback →
            </router-link>
          </div>
          <div class="text-sm">
            <router-link
              to="/admin/login"
              class="text-gray-500 hover:text-gray-700"
            >
              Admin Portal
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="text-center">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-primary-600 text-3xl mb-4">📶</div>
            <h3 class="text-lg font-semibold mb-2">Reliable WiFi</h3>
            <p class="text-gray-600">Find places with fast, stable internet for productive work sessions.</p>
          </div>
        </div>
        
        <div class="text-center">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-primary-600 text-3xl mb-4">🔌</div>
            <h3 class="text-lg font-semibold mb-2">Power Outlets</h3>
            <p class="text-gray-600">Work as long as you need with accessible charging options.</p>
          </div>
        </div>
        
        <div class="text-center">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-primary-600 text-3xl mb-4">🗺️</div>
            <h3 class="text-lg font-semibold mb-2">Easy Navigation</h3>
            <p class="text-gray-600">Get instant directions with Google Maps integration.</p>
          </div>
        </div>
      </div>
      
      <!-- Newsletter Signup Section -->
      <div class="mt-16 max-w-2xl mx-auto">
        <NewsletterSignup 
          signup-source="homepage"
          :default-cities="['Berlin']"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import NewsletterSignup from '../components/NewsletterSignup.vue'
</script>
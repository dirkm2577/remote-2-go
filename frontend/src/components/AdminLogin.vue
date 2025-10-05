<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-xl shadow-sm p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Admin Access
        </h1>
        <p class="text-gray-600 text-sm">
          Enter your admin password to access the dashboard
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter admin password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :disabled="adminStore.isLoading"
          />
        </div>

        <div v-if="adminStore.error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {{ adminStore.error }}
        </div>

        <button
          type="submit"
          :disabled="adminStore.isLoading || !password.trim()"
          class="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="adminStore.isLoading">Authenticating...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/" class="text-primary-600 hover:text-primary-700 text-sm">
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()
const password = ref('')

const handleLogin = async () => {
  adminStore.clearError()
  
  const success = await adminStore.login(password.value)
  
  if (success) {
    router.push('/admin')
  }
}
</script>
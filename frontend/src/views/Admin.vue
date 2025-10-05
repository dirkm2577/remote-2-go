<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-xl font-bold text-primary-600">
              Remote2Go Admin
            </router-link>
            <span class="text-gray-400">|</span>
            <span class="text-sm text-gray-600">Dashboard</span>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshData"
              :disabled="adminStore.isLoading"
              class="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              title="Refresh Data"
            >
              <span v-if="adminStore.isLoading">⟳</span>
              <span v-else>🔄</span>
            </button>
            <button
              @click="adminStore.logout(); $router.push('/admin/login')"
              class="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <!-- Error Message -->
      <div v-if="adminStore.error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ adminStore.error }}
        <button @click="adminStore.clearError()" class="ml-2 text-red-500 hover:text-red-700">×</button>
      </div>

      <!-- Stats Overview -->
      <div v-if="adminStore.stats" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-2xl font-bold text-blue-600">{{ adminStore.stats.totalPlaces }}</div>
            <div class="text-sm text-gray-600">Total Places</div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-2xl font-bold text-orange-600">{{ adminStore.stats.pendingPlaces }}</div>
            <div class="text-sm text-gray-600">Pending Submissions</div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-2xl font-bold text-indigo-600">{{ adminStore.stats.totalSubmissions }}</div>
            <div class="text-sm text-gray-600">Total Submissions</div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-2xl font-bold text-green-600">{{ adminStore.stats.totalSubscribers }}</div>
            <div class="text-sm text-gray-600">Newsletter Subscribers</div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-2xl font-bold text-purple-600">{{ adminStore.stats.totalFeedback }}</div>
            <div class="text-sm text-gray-600">Total Feedback</div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="text-2xl font-bold text-red-600">{{ adminStore.stats.newFeedback }}</div>
            <div class="text-sm text-gray-600">New Feedback</div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.label }}
              <span v-if="tab.count !== undefined" class="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-xl shadow-sm">
        <!-- Places Tab -->
        <div v-if="activeTab === 'places'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Approved Places</h3>
            <button
              @click="adminStore.fetchPlaces()"
              :disabled="adminStore.isLoading"
              class="btn btn-secondary text-sm"
            >
              Refresh
            </button>
          </div>
          
          <PlacesManagement />
        </div>

        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Place Submissions</h3>
            <button
              @click="adminStore.fetchSubmissions()"
              :disabled="adminStore.isLoading"
              class="btn btn-secondary text-sm"
            >
              Refresh
            </button>
          </div>
          
          <SubmissionsManagement />
        </div>

        <!-- Subscriptions Tab -->
        <div v-if="activeTab === 'subscriptions'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Newsletter Subscriptions</h3>
            <button
              @click="adminStore.fetchSubscriptions()"
              :disabled="adminStore.isLoading"
              class="btn btn-secondary text-sm"
            >
              Refresh
            </button>
          </div>
          
          <SubscriptionsManagement />
        </div>

        <!-- Feedback Tab -->
        <div v-if="activeTab === 'feedback'" class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">User Feedback</h3>
            <button
              @click="adminStore.fetchFeedback()"
              :disabled="adminStore.isLoading"
              class="btn btn-secondary text-sm"
            >
              Refresh
            </button>
          </div>
          
          <FeedbackManagement />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/admin'
import PlacesManagement from '../components/admin/PlacesManagement.vue'
import SubmissionsManagement from '../components/admin/SubmissionsManagement.vue'
import SubscriptionsManagement from '../components/admin/SubscriptionsManagement.vue'
import FeedbackManagement from '../components/admin/FeedbackManagement.vue'

const router = useRouter()
const adminStore = useAdminStore()
const activeTab = ref('places')

const tabs = computed(() => [
  {
    id: 'places',
    label: 'Places',
    count: adminStore.stats?.totalPlaces
  },
  {
    id: 'submissions',
    label: 'Submissions',
    count: adminStore.stats?.pendingPlaces
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    count: adminStore.stats?.totalSubscribers
  },
  {
    id: 'feedback',
    label: 'Feedback',
    count: adminStore.stats?.newFeedback
  }
])

const refreshData = async () => {
  await Promise.all([
    adminStore.fetchStats(),
    adminStore.fetchPlaces(),
    adminStore.fetchSubmissions(),
    adminStore.fetchSubscriptions(),
    adminStore.fetchFeedback()
  ])
}

onMounted(async () => {
  if (!adminStore.isAuthenticated) {
    router.push('/admin/login')
    return
  }

  await refreshData()
})
</script>
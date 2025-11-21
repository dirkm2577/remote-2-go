<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            Remote2Go
          </router-link>
          <div class="text-sm text-gray-600">
            {{ filteredPlaces.length }} places found
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="lg:flex lg:gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-80 mb-8 lg:mb-0">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-6">Filters</h2>
            
            <!-- Open Now Filter -->
            <div class="mb-6 pb-6 border-b border-gray-200">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="filters.openNow"
                  type="checkbox"
                  class="mr-3 text-primary-600 w-5 h-5 rounded"
                >
                <div>
                  <span class="text-sm font-medium text-gray-900">Open Now</span>
                  <p class="text-xs text-gray-500 mt-0.5">Show only places currently open</p>
                </div>
              </label>
            </div>

            <!-- City Filter -->
            <div class="mb-6">
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                v-model="filters.city"
                type="text"
                id="city"
                class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter city name..."
              />
            </div>

            <!-- Visit Type Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Visit Type</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="filters.visitType"
                    value=""
                    type="radio"
                    class="mr-3 text-primary-600"
                  >
                  <span>All Types</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.visitType"
                    value="quick_stop"
                    type="radio"
                    class="mr-3 text-primary-600"
                  >
                  <span>Quick Stop (1-3 hours)</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.visitType"
                    value="day_visit"
                    type="radio"
                    class="mr-3 text-primary-600"
                  >
                  <span>Day Visit (4-8 hours)</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="filters.visitType"
                    value="multi_day"
                    type="radio"
                    class="mr-3 text-primary-600"
                  >
                  <span>Multi-Day Stay</span>
                </label>
              </div>
            </div>

            <!-- Other Filters -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">WiFi Quality</label>
                <select v-model="filters.wifiQuality" class="w-full p-2 border rounded-lg">
                  <option value="">Any</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Noise Level</label>
                <select v-model="filters.noiseLevel" class="w-full p-2 border rounded-lg">
                  <option value="">Any</option>
                  <option value="quiet">Quiet</option>
                  <option value="moderate">Moderate</option>
                  <option value="lively">Lively</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Power Outlets</label>
                <select v-model="filters.powerOutlets" class="w-full p-2 border rounded-lg">
                  <option value="">Any</option>
                  <option value="many">Many Available</option>
                  <option value="some">Some Available</option>
                  <option value="limited">Limited</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price Level</label>
                <select v-model="filters.priceLevel" class="w-full p-2 border rounded-lg">
                  <option value="">Any</option>
                  <option value="free">Free</option>
                  <option value="low">$ Low</option>
                  <option value="medium">$$ Medium</option>
                  <option value="high">$$$ High</option>
                </select>
              </div>
            </div>

            <button
              @click="clearFilters"
              class="w-full mt-6 btn btn-secondary"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        <!-- Places List -->
        <div class="flex-1">
          <div class="grid gap-6">
            <div
              v-for="place in filteredPlaces"
              :key="place.id"
              class="bg-white rounded-xl shadow-sm p-6"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-semibold mb-1">{{ place.name }}</h3>
                  <p class="text-gray-600">{{ place.address }}</p>
                </div>
                <span
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="getVisitTypeBadgeClass(place.visit_type)"
                >
                  {{ getVisitTypeLabel(place.visit_type) }}
                </span>
              </div>

              <p class="text-gray-700 mb-4">{{ place.description }}</p>

              <!-- Photo Gallery -->
              <div class="mb-6">
                <PlacePhotoGallery 
                  :place="place" 
                  :max-photos="5"
                  class="rounded-lg"
                />
              </div>

              <!-- Opening Hours -->
              <div class="mb-6 border-t pt-6">
                <OpeningHoursDisplay 
                  :opening-hours="place.opening_hours"
                  :last-verified="place.hours_last_verified_at"
                />
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div class="text-center">
                  <div class="text-lg mb-1">📶</div>
                  <div class="text-sm text-gray-600">{{ place.wifi_quality }}</div>
                </div>
                <div class="text-center">
                  <div class="text-lg mb-1">🔌</div>
                  <div class="text-sm text-gray-600">{{ place.power_outlets }}</div>
                </div>
                <div class="text-center">
                  <div class="text-lg mb-1">🔇</div>
                  <div class="text-sm text-gray-600">{{ place.noise_level }}</div>
                </div>
                <div class="text-center">
                  <div class="text-lg mb-1">💰</div>
                  <div class="text-sm text-gray-600">{{ place.price_level }}</div>
                </div>
              </div>

              <button
                @click="openInMaps(place.latitude, place.longitude)"
                class="btn btn-primary w-full md:w-auto"
              >
                Open in Maps
              </button>
            </div>
          </div>

          <div
            v-if="filteredPlaces.length === 0"
            class="text-center py-12"
          >
            <div class="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No places found</h3>
            <p class="text-gray-600">Try adjusting your filters to find more places.</p>
          </div>
          
          <!-- Newsletter Signup -->
          <div class="mt-12">
            <NewsletterSignup 
              signup-source="places_page"
              :default-cities="['Berlin']"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePlacesStore } from '../stores/places'
import { isCurrentlyOpen } from '../types/OpeningHours'
import NewsletterSignup from '../components/NewsletterSignup.vue'
import PlacePhotoGallery from '../components/PlacePhotoGallery.vue'
import OpeningHoursDisplay from '../components/OpeningHoursDisplay.vue'

const placesStore = usePlacesStore()

const filters = ref({
  visitType: '',
  wifiQuality: '',
  noiseLevel: '',
  powerOutlets: '',
  priceLevel: '',
  city: '',
  openNow: false
})

// Apply client-side filtering for "Open Now"
const filteredPlaces = computed(() => {
  let places = placesStore.places

  // Apply "Open Now" filter (client-side)
  if (filters.value.openNow) {
    places = places.filter(place => isCurrentlyOpen(place.opening_hours))
  }

  return places
})

const clearFilters = () => {
  filters.value = {
    visitType: '',
    wifiQuality: '',
    noiseLevel: '',
    powerOutlets: '',
    priceLevel: '',
    city: '',
    openNow: false
  }
  // Refetch places with no filters
  placesStore.fetchPlaces()
}

// Watch for filter changes and refetch data
watch(filters, () => {
  const filterParams = {
    visitType: filters.value.visitType || undefined,
    wifiQuality: filters.value.wifiQuality || undefined,
    noiseLevel: filters.value.noiseLevel || undefined,
    powerOutlets: filters.value.powerOutlets || undefined,
    priceLevel: filters.value.priceLevel || undefined,
    city: filters.value.city || undefined,
  }
  
  // Remove undefined values
  const cleanFilters = Object.fromEntries(
    Object.entries(filterParams).filter(([_, v]) => v !== undefined && v !== '')
  )
  
  placesStore.fetchPlaces(cleanFilters)
}, { deep: true })

const getVisitTypeLabel = (visitType: string) => {
  const labels: Record<string, string> = {
    quick_stop: 'Quick Stop',
    day_visit: 'Day Visit',
    multi_day: 'Multi-Day'
  }
  return labels[visitType] || visitType
}

const getVisitTypeBadgeClass = (visitType: string) => {
  const classes: Record<string, string> = {
    quick_stop: 'bg-green-100 text-green-800',
    day_visit: 'bg-blue-100 text-blue-800',
    multi_day: 'bg-purple-100 text-purple-800'
  }
  return classes[visitType] || 'bg-gray-100 text-gray-800'
}

const openInMaps = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`
  window.open(url, '_blank')
}

onMounted(() => {
  placesStore.fetchPlaces()
})
</script>
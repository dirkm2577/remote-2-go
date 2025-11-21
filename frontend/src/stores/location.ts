import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export const useLocationStore = defineStore('location', () => {
  const userLocation = ref<UserLocation | null>(null)
  const locationPermission = ref<'granted' | 'denied' | 'prompt'>('prompt')
  const isLoadingLocation = ref(false)
  const locationError = ref<string | null>(null)

  // Computed property
  const hasLocation = computed(() => userLocation.value !== null)

  /**
   * Request user's location using browser geolocation API
   */
  const requestLocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      locationError.value = 'Geolocation is not supported by your browser'
      return false
    }

    isLoadingLocation.value = true
    locationError.value = null

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          userLocation.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          }
          locationPermission.value = 'granted'
          isLoadingLocation.value = false

          // Save to localStorage for persistence
          try {
            localStorage.setItem('lastKnownLocation', JSON.stringify(userLocation.value))
          } catch (e) {
            console.warn('Failed to save location to localStorage:', e)
          }

          resolve(true)
        },
        // Error callback
        (error) => {
          isLoadingLocation.value = false

          switch (error.code) {
            case error.PERMISSION_DENIED:
              locationPermission.value = 'denied'
              locationError.value = 'Location permission was denied'
              break
            case error.POSITION_UNAVAILABLE:
              locationError.value = 'Location information is unavailable'
              break
            case error.TIMEOUT:
              locationError.value = 'Location request timed out'
              break
            default:
              locationError.value = 'An unknown error occurred while getting location'
          }

          resolve(false)
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  /**
   * Load cached location from localStorage
   */
  const loadCachedLocation = (): void => {
    try {
      const cached = localStorage.getItem('lastKnownLocation')
      if (cached) {
        const parsed = JSON.parse(cached) as UserLocation
        // Validate the parsed data has required fields
        if (
          typeof parsed.latitude === 'number' &&
          typeof parsed.longitude === 'number' &&
          typeof parsed.accuracy === 'number' &&
          typeof parsed.timestamp === 'number'
        ) {
          userLocation.value = parsed
        }
      }
    } catch (e) {
      console.warn('Failed to load cached location:', e)
    }
  }

  /**
   * Clear stored location
   */
  const clearLocation = (): void => {
    userLocation.value = null
    try {
      localStorage.removeItem('lastKnownLocation')
    } catch (e) {
      console.warn('Failed to remove location from localStorage:', e)
    }
  }

  // Initialize by loading cached location
  loadCachedLocation()

  return {
    userLocation,
    locationPermission,
    isLoadingLocation,
    locationError,
    hasLocation,
    requestLocation,
    loadCachedLocation,
    clearLocation
  }
})

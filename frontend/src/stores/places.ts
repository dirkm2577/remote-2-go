import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Place, PlaceFilters } from '../types/Place'

export const usePlacesStore = defineStore('places', () => {
  const places = ref<Place[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPlaces = async (filters?: PlaceFilters) => {
    loading.value = true
    error.value = null
    
    try {
      // Build API URL with query parameters
      const params = new URLSearchParams()
      if (filters?.visitType) params.append('visitType', filters.visitType)
      if (filters?.wifiQuality) params.append('wifiQuality', filters.wifiQuality)
      if (filters?.noiseLevel) params.append('noiseLevel', filters.noiseLevel)
      if (filters?.powerOutlets !== undefined) params.append('powerOutlets', filters.powerOutlets.toString())
      if (filters?.priceLevel) params.append('priceLevel', filters.priceLevel)
      if (filters?.city) params.append('city', filters.city)
      
      const url = `http://localhost:3001/api/places${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const result = await response.json()
      places.value = result.data || []
    } catch (err) {
      console.error('Error fetching places:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch places'
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock data due to error')
      places.value = [
        {
          id: '1',
          name: 'Café Central',
          address: 'Hackescher Markt 2, 10178 Berlin',
          city: 'Berlin',
          latitude: 52.5225,
          longitude: 13.4017,
          wifi_quality: 'excellent',
          noise_level: 'moderate',
          power_outlets: true,
          time_limit: 180,
          price_level: 'medium',
          visit_type: 'day_visit',
          amenities: ['wifi', 'power_outlets', 'coffee', 'food'],
          description: 'Spacious café in the heart of Berlin with excellent WiFi and plenty of seating.',
          status: 'active',
          verified: true,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          google_place_id: null,
          photos: []
        },
        {
          id: '2',
          name: 'Berlin Central Library',
          address: 'Breite Str. 36, 10178 Berlin',
          city: 'Berlin',
          latitude: 52.5170,
          longitude: 13.4099,
          wifi_quality: 'excellent',
          noise_level: 'quiet',
          power_outlets: true,
          time_limit: null,
          price_level: 'free',
          visit_type: 'multi_day',
          amenities: ['wifi', 'power_outlets', 'quiet_space'],
          description: 'Public library with dedicated work areas and excellent facilities.',
          status: 'active',
          verified: true,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          google_place_id: null,
          photos: []
        },
        {
          id: '3',
          name: 'Rocket Internet Hub',
          address: 'Unter den Linden 26-30, 10117 Berlin',
          city: 'Berlin',
          latitude: 52.5175,
          longitude: 13.3906,
          wifi_quality: 'excellent',
          noise_level: 'moderate',
          power_outlets: true,
          time_limit: null,
          price_level: 'high',
          visit_type: 'day_visit',
          amenities: ['wifi', 'power_outlets', 'meeting_rooms', 'coffee'],
          description: 'Premium coworking space with professional atmosphere and all amenities.',
          status: 'active',
          verified: true,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          google_place_id: null,
          photos: []
        }
      ].filter(place => {
        if (filters?.visitType && place.visit_type !== filters.visitType) return false
        if (filters?.wifiQuality && place.wifi_quality !== filters.wifiQuality) return false
        if (filters?.noiseLevel && place.noise_level !== filters.noiseLevel) return false
        if (filters?.powerOutlets !== undefined && place.power_outlets !== filters.powerOutlets) return false
        if (filters?.priceLevel && place.price_level !== filters.priceLevel) return false
        if (filters?.city && !place.city.toLowerCase().includes(filters.city.toLowerCase())) return false
        return true
      }) as Place[]
    } finally {
      loading.value = false
    }
  }

  return {
    places,
    loading,
    error,
    fetchPlaces
  }
})
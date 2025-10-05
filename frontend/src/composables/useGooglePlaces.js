/**
 * Google Places API Composable for fetching place photos and data
 * Uses the new Google Places API (v1) with proper attribution requirements
 */

import { ref } from 'vue'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
const PLACES_API_BASE = 'https://places.googleapis.com/v1'

// console.log('useGooglePlaces - import.meta.env:', import.meta.env)
// console.log('useGooglePlaces - VITE_GOOGLE_PLACES_API_KEY:', import.meta.env.VITE_GOOGLE_PLACES_API_KEY)
// console.log('useGooglePlaces - API_KEY loaded:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND')

export function useGooglePlaces() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Find Google Place ID and photos for a given place name and address
   * @param {string} placeName - Name of the place
   * @param {string} address - Address of the place
   * @returns {Promise<{placeId: string, photos: Array}>} Place ID and photos array
   */
  async function findPlaceId(placeName, address) {
    loading.value = true
    error.value = null

    try {
      const searchQuery = `${placeName} ${address}`.trim()
      
      const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.photos'
        },
        body: JSON.stringify({
          textQuery: searchQuery,
          maxResultCount: 1
        })
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Google Places API quota exceeded. Please try again later.')
        }
        throw new Error(`Google Places API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.places || data.places.length === 0) {
        return {
          placeId: null,
          photos: []
        }
      }

      const place = data.places[0]
      
      return {
        placeId: place.id,
        photos: place.photos || []
      }

    } catch (err) {
      error.value = err.message
      console.error('Error finding place ID:', err)
      return {
        placeId: null,
        photos: []
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Generate photo URL from Google Places photo name
   * @param {string} photoName - Photo name from Google Places API (e.g., "places/ChIJ.../photos/AW30...")
   * @param {number} maxWidth - Maximum width in pixels (default: 800)
   * @returns {string} Photo URL
   */
  function getPhotoUrl(photoName, maxWidth = 800) {
    // console.log('getPhotoUrl called with:', { photoName, maxWidth, API_KEY: API_KEY ? 'present' : 'missing' })
    
    if (!photoName) {
      console.log('getPhotoUrl returning null: no photoName')
      return null
    }
    
    if (!API_KEY) {
      console.log('getPhotoUrl returning null: no API_KEY')
      return null
    }

    // Ensure maxWidth is within reasonable bounds
    const width = Math.min(Math.max(maxWidth, 100), 4800)
    
    // photoName already includes the full path like "places/ChIJ.../photos/..."
    const url = `${PLACES_API_BASE}/${photoName}/media?maxWidthPx=${width}&key=${API_KEY}`
    // console.log('getPhotoUrl generated URL:', url)
    return url
  }

  /**
   * Process array of photos into URLs with attributions
   * @param {Array} photos - Array of photo objects from Google Places API
   * @param {number} maxWidth - Maximum width in pixels (default: 800)
   * @returns {Array} Array of processed photo objects with URLs
   */
  function getPhotoUrls(photos, maxWidth = 800) {
    // console.log('useGooglePlaces - getPhotoUrls called with:', photos)
    
    if (!photos || !Array.isArray(photos)) {
      console.log('useGooglePlaces - No valid photos array')
      return []
    }

    const result = photos.map(photo => {
      const url = getPhotoUrl(photo.name, maxWidth)
      // console.log('useGooglePlaces - Generated URL for photo:', photo.name, '→', url)
      
      return {
        url,
        width: photo.widthPx,
        height: photo.heightPx,
        attribution: photo.authorAttributions?.[0]?.displayName || 'Unknown',
        originalPhoto: photo
      }
    })
    
    // console.log('useGooglePlaces - Final processed photos:', result)
    return result
  }

  /**
   * Get multiple photo URLs with different sizes for responsive images
   * @param {string} photoName - Photo name from Google Places API
   * @param {Array} sizes - Array of widths (default: [400, 800, 1200])
   * @returns {Object} Object with different sized URLs
   */
  function getResponsivePhotoUrls(photoName, sizes = [400, 800, 1200]) {
    if (!photoName) {
      return {}
    }

    const urls = {}
    sizes.forEach(size => {
      urls[`w${size}`] = getPhotoUrl(photoName, size)
    })
    
    return urls
  }

  /**
   * Check if Google Places API is available and configured
   * @returns {boolean} True if API key is configured
   */
  function isApiConfigured() {
    return !!API_KEY
  }

  /**
   * Get Google attribution requirements for display
   * @returns {Object} Attribution requirements
   */
  function getAttributionRequirements() {
    return {
      googleLogoUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
      requiresGoogleLogo: true,
      requiresPhotographerCredit: true,
      termsOfServiceUrl: 'https://policies.google.com/terms'
    }
  }

  return {
    // State
    loading,
    error,
    
    // Methods
    findPlaceId,
    getPhotoUrl,
    getPhotoUrls,
    getResponsivePhotoUrls,
    isApiConfigured,
    getAttributionRequirements
  }
}
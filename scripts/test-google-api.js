#!/usr/bin/env node

/**
 * Google Places API Test Script
 * Verifies that the Google Places API is working correctly with your setup
 * Run with: node scripts/test-google-api.js
 */

import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env.local')
dotenv.config({ path: envPath })

const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY
const PLACES_API_BASE = 'https://places.googleapis.com/v1'

// Test queries
const TEST_QUERIES = [
  {
    name: 'Starbucks Downtown Seattle',
    address: '1912 Pike Pl, Seattle, WA 98101, USA',
    description: 'Popular coffee chain location'
  },
  {
    name: 'Central Park',
    address: 'New York, NY, USA',
    description: 'Famous park in Manhattan'
  },
  {
    name: 'Cafe de Flore',
    address: 'Paris, France',
    description: 'Historic Parisian cafe'
  }
]

/**
 * Test Google Places API search functionality
 * @param {string} placeName - Name of the place to search
 * @param {string} address - Address of the place
 * @returns {Promise<Object>} Test result
 */
async function testPlaceSearch(placeName, address) {
  const searchQuery = `${placeName} ${address}`.trim()
  
  try {
    console.log(`🔍 Searching for: "${searchQuery}"`)
    
    const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.photos,places.formattedAddress'
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: 1
      })
    })
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorBody = await response.text()
        if (errorBody) {
          errorMessage += ` - ${errorBody}`
        }
      } catch (e) {
        // Ignore errors when reading error body
      }
      
      return {
        success: false,
        error: errorMessage,
        status: response.status
      }
    }

    const data = await response.json()
    
    if (!data.places || data.places.length === 0) {
      return {
        success: false,
        error: 'No places found in search results',
        searchQuery
      }
    }

    const place = data.places[0]
    
    return {
      success: true,
      place: {
        id: place.id,
        name: place.displayName?.text || 'Unknown',
        address: place.formattedAddress || 'Unknown',
        photoCount: place.photos ? place.photos.length : 0,
        photos: place.photos || []
      },
      searchQuery
    }

  } catch (error) {
    return {
      success: false,
      error: error.message,
      searchQuery
    }
  }
}

/**
 * Test photo URL generation
 * @param {string} photoName - Photo name from Google Places API
 * @param {number} width - Desired width
 * @returns {Promise<Object>} Test result
 */
async function testPhotoUrl(photoName, width = 400) {
  try {
    const photoUrl = `${PLACES_API_BASE}/${photoName}/media?maxWidthPx=${width}&key=${GOOGLE_PLACES_API_KEY}`
    
    console.log(`📸 Testing photo URL (${width}px width)...`)
    console.log(`🔗 Photo URL: ${photoUrl}`)
    
    const response = await fetch(photoUrl, { method: 'GET' })
    
    if (!response.ok) {
      console.log(`   📝 Response headers:`, Object.fromEntries(response.headers.entries()))
      // Try to get error details
      try {
        const errorText = await response.text()
        if (errorText) {
          console.log(`   📝 Error body:`, errorText.substring(0, 200))
        }
      } catch (e) {
        console.log(`   📝 Could not read error body`)
      }
    }
    
    return {
      success: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      url: photoUrl
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url: `${PLACES_API_BASE}/${photoName}/media?maxWidthPx=${width}&key=${GOOGLE_PLACES_API_KEY}`
    }
  }
}

/**
 * Validate API key format
 * @param {string} apiKey - Google Places API key
 * @returns {Object} Validation result
 */
function validateApiKey(apiKey) {
  if (!apiKey) {
    return {
      valid: false,
      error: 'API key is missing'
    }
  }
  
  if (typeof apiKey !== 'string') {
    return {
      valid: false,
      error: 'API key must be a string'
    }
  }
  
  if (apiKey.length < 10) {
    return {
      valid: false,
      error: 'API key appears to be too short'
    }
  }
  
  if (!apiKey.startsWith('AIza')) {
    return {
      valid: false,
      error: 'Google API keys typically start with "AIza"'
    }
  }
  
  return {
    valid: true,
    length: apiKey.length
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('🧪 Google Places API Test Suite')
  console.log('=' .repeat(50))
  
  // Validate environment setup
  console.log('\n1️⃣ Environment Setup Validation')
  console.log('-'.repeat(30))
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('❌ VITE_GOOGLE_PLACES_API_KEY environment variable is not set')
    console.log('\n💡 To fix this:')
    console.log('   1. Copy .env.example to .env.local')
    console.log('   2. Add your Google Places API key to VITE_GOOGLE_PLACES_API_KEY')
    console.log('   3. Make sure the API key has Places API (New) enabled')
    return
  }
  
  const keyValidation = validateApiKey(GOOGLE_PLACES_API_KEY)
  if (!keyValidation.valid) {
    console.error(`❌ API key validation failed: ${keyValidation.error}`)
    return
  }
  
  console.log('✅ Environment variables loaded')
  console.log(`✅ API key format appears valid (${keyValidation.length} characters)`)
  console.log(`🔑 API key: ${GOOGLE_PLACES_API_KEY.substring(0, 10)}...${GOOGLE_PLACES_API_KEY.substring(GOOGLE_PLACES_API_KEY.length - 4)}`)
  
  // Test place searches
  console.log('\n2️⃣ Place Search Tests')
  console.log('-'.repeat(30))
  
  let successfulSearches = 0
  let searchResults = []
  
  for (const testQuery of TEST_QUERIES) {
    console.log(`\n🏢 Testing: ${testQuery.name}`)
    console.log(`   Description: ${testQuery.description}`)
    
    const result = await testPlaceSearch(testQuery.name, testQuery.address)
    searchResults.push({ testQuery, result })
    
    if (result.success) {
      console.log(`   ✅ Found: ${result.place.name}`)
      console.log(`   📍 Address: ${result.place.address}`)
      console.log(`   📸 Photos: ${result.place.photoCount}`)
      console.log(`   🆔 Place ID: ${result.place.id}`)
      successfulSearches++
    } else {
      console.log(`   ❌ Failed: ${result.error}`)
      if (result.status === 403) {
        console.log('   💡 HTTP 403 Forbidden - Possible causes:')
        console.log('      • API key has HTTP referrer restrictions enabled')
        console.log('      • Places API (New) is not enabled for this project')
        console.log('      • Billing is not enabled')
        console.log('      • IP address restrictions (if any)')
        if (result.error.includes('API_KEY_HTTP_REFERRER_BLOCKED')) {
          console.log('      🔧 SOLUTION: Remove HTTP referrer restrictions from your API key')
          console.log('         or add your local IP/domain to allowed referrers')
        }
      } else if (result.status === 429) {
        console.log('   💡 This is a rate limiting issue - try again later')
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Test photo URLs if we have photos
  console.log('\n3️⃣ Photo URL Tests')
  console.log('-'.repeat(30))
  
  let photoTestResults = []
  
  for (const { result } of searchResults) {
    if (result.success && result.place.photos.length > 0) {
      const firstPhoto = result.place.photos[0]
      console.log(`\n📸 Testing photo from: ${result.place.name}`)
      console.log(`   🔍 Photo name: ${firstPhoto.name}`)
      console.log(`   📐 Dimensions: ${firstPhoto.widthPx}x${firstPhoto.heightPx}`)
      
      const photoResult = await testPhotoUrl(firstPhoto.name, 400)
      photoTestResults.push(photoResult)
      
      if (photoResult.success) {
        console.log(`   ✅ Photo URL accessible`)
        console.log(`   📏 Content-Type: ${photoResult.contentType || 'Unknown'}`)
        if (photoResult.contentLength) {
          const sizeKB = Math.round(parseInt(photoResult.contentLength) / 1024)
          console.log(`   📦 Size: ~${sizeKB}KB`)
        }
      } else {
        console.log(`   ❌ Photo URL failed: ${photoResult.error || `Status ${photoResult.status}`}`)
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100))
      break // Only test one photo
    }
  }
  
  // Final summary
  console.log('\n4️⃣ Test Summary')
  console.log('-'.repeat(30))
  
  const totalTests = TEST_QUERIES.length
  const searchSuccessRate = ((successfulSearches / totalTests) * 100).toFixed(1)
  
  console.log(`🔍 Place Search Results: ${successfulSearches}/${totalTests} successful (${searchSuccessRate}%)`)
  
  if (photoTestResults.length > 0) {
    const successfulPhotoTests = photoTestResults.filter(r => r.success).length
    const photoSuccessRate = ((successfulPhotoTests / photoTestResults.length) * 100).toFixed(1)
    console.log(`📸 Photo URL Results: ${successfulPhotoTests}/${photoTestResults.length} successful (${photoSuccessRate}%)`)
  } else {
    console.log(`📸 Photo URL Results: No photos found to test`)
  }
  
  if (successfulSearches === totalTests && photoTestResults.every(r => r.success)) {
    console.log('\n🎉 All tests passed! Your Google Places API integration is working correctly.')
    console.log('\n✅ Next steps:')
    console.log('   1. Run the SQL migration: database/google_places_migration.sql')
    console.log('   2. Use the backfill script: node scripts/fetch-place-photos.js')
    console.log('   3. Integrate PlacePhotoGallery component in your views')
  } else {
    console.log('\n⚠️ Some tests failed. Please check:')
    console.log('   1. Your API key has Places API (New) enabled in Google Cloud Console')
    console.log('   2. Billing is enabled for your Google Cloud project')
    console.log('   3. The API key restrictions allow your domain (if any)')
  }
  
  console.log('\n📚 Documentation:')
  console.log('   - Google Places API: https://developers.google.com/maps/documentation/places/web-service/overview')
  console.log('   - Pricing: https://developers.google.com/maps/documentation/places/web-service/usage-and-billing')
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test interrupted by user')
  process.exit(0)
})

// Run tests
runTests().catch(error => {
  console.error('\n💥 Unexpected error:', error)
  process.exit(1)
})
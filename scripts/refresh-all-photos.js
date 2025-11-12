#!/usr/bin/env node

/**
 * Refresh ALL photos using the New Google Places API v1
 * This replaces expired photo_reference with permanent photo names
 * Run with: node scripts/refresh-all-photos.js
 */

import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env.local')
dotenv.config({ path: envPath })

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY

const REQUEST_DELAY = 150 // 150ms delay between requests
const PLACES_API_BASE = 'https://places.googleapis.com/v1'

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GOOGLE_PLACES_API_KEY) {
  console.error('❌ Missing required environment variables:')
  if (!SUPABASE_URL) console.error('  - SUPABASE_URL or VITE_SUPABASE_URL')
  if (!SUPABASE_SERVICE_ROLE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  if (!GOOGLE_PLACES_API_KEY) console.error('  - VITE_GOOGLE_PLACES_API_KEY')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

/**
 * Search Google Places API v1 for a place
 * Returns photos with stable "name" fields that don't expire
 */
async function searchGooglePlace(placeName, address) {
  try {
    const searchQuery = `${placeName} ${address}`.trim()

    const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.photos'
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: 1
      })
    })

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`⚠️  Rate limit hit for "${placeName}". Waiting...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        return { placeId: null, photos: [] }
      }
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.places || data.places.length === 0) {
      return { placeId: null, photos: [] }
    }

    const place = data.places[0]

    // Return photos with "name" field (stable, doesn't expire)
    return {
      placeId: place.id,
      photos: place.photos || []
    }

  } catch (error) {
    console.error(`Error searching for "${placeName}":`, error.message)
    return { placeId: null, photos: [] }
  }
}

/**
 * Update place in Supabase with fresh photo data
 */
async function updatePlaceInSupabase(placeId, googlePlaceId, photos) {
  const { error } = await supabase
    .from('places')
    .update({
      google_place_id: googlePlaceId,
      photos: photos
    })
    .eq('id', placeId)

  if (error) {
    throw new Error(`Failed to update place ${placeId}: ${error.message}`)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Refreshing ALL photos using Google Places API v1...\n')
  console.log('📝 This will replace expired photo_reference with permanent photo names\n')

  try {
    // Get ALL places (not just those without google_place_id)
    const { data: places, error } = await supabase
      .from('places')
      .select('id, name, address, city, google_place_id')
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch places: ${error.message}`)
    }

    if (!places || places.length === 0) {
      console.log('✨ No places found in database!')
      return
    }

    console.log(`📋 Found ${places.length} places to refresh\n`)

    const results = {
      processed: 0,
      success: 0,
      notFound: 0,
      errors: 0
    }

    // Process each place
    for (const place of places) {
      try {
        console.log(`🔍 [${results.processed + 1}/${places.length}] Processing: ${place.name}`)

        const { placeId, photos } = await searchGooglePlace(
          place.name,
          `${place.address}, ${place.city}`
        )

        if (placeId && photos.length > 0) {
          await updatePlaceInSupabase(place.id, placeId, photos)
          console.log(`   ✅ Updated with ${photos.length} photos`)
          results.success++
        } else if (placeId && photos.length === 0) {
          // Found place but no photos
          await updatePlaceInSupabase(place.id, placeId, [])
          console.log(`   ⚠️  Found but no photos available`)
          results.success++
        } else {
          console.log(`   ❌ Not found on Google Places`)
          results.notFound++
        }

        results.processed++

        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY))

      } catch (error) {
        console.error(`   💥 Error: ${error.message}`)
        results.errors++
        results.processed++
      }
    }

    // Print summary
    console.log('\n' + '═'.repeat(60))
    console.log('📊 SUMMARY')
    console.log('═'.repeat(60))
    console.log(`Total processed: ${results.processed}`)
    console.log(`✅ Successfully updated: ${results.success}`)
    console.log(`❌ Not found: ${results.notFound}`)
    console.log(`💥 Errors: ${results.errors}`)
    console.log('═'.repeat(60))

    if (results.success > 0) {
      console.log('\n✨ Photos refreshed! All photos now use permanent photo names.')
      console.log('💡 These photo names won\'t expire like photo_reference did.')
    }

  } catch (error) {
    console.error('\n💥 Fatal error:', error.message)
    process.exit(1)
  }
}

// Run the script
main()

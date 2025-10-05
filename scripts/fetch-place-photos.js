#!/usr/bin/env node

/**
 * Backfill script for Google Places API photos
 * Fetches Google Place IDs and photos for existing places in Supabase
 * Run with: node scripts/fetch-place-photos.js
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

// Configuration - Try multiple environment variable formats
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY

const BATCH_SIZE = 10
const REQUEST_DELAY = 150 // 150ms delay between requests to avoid rate limiting
const PLACES_API_BASE = 'https://places.googleapis.com/v1'

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GOOGLE_PLACES_API_KEY) {
  console.error('❌ Missing required environment variables:')
  if (!SUPABASE_URL) console.error('  - SUPABASE_URL or VITE_SUPABASE_URL')
  if (!SUPABASE_SERVICE_ROLE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY (not the anon key!)')
  if (!GOOGLE_PLACES_API_KEY) console.error('  - VITE_GOOGLE_PLACES_API_KEY')
  
  console.log('\n💡 To get your Supabase service role key:')
  console.log('   1. Go to your Supabase project dashboard')
  console.log('   2. Click on Settings → API')
  console.log('   3. Copy the "service_role" key (not the "anon" key)')
  console.log('   4. Add it to your .env.local file as SUPABASE_SERVICE_ROLE_KEY')
  
  process.exit(1)
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

/**
 * Search Google Places API for a place
 * @param {string} placeName - Name of the place
 * @param {string} address - Address of the place
 * @returns {Promise<{placeId: string|null, photos: Array}>}
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
        console.warn(`⚠️ Rate limit hit for "${placeName}". Waiting...`)
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
 * Update place in Supabase with Google Place data
 * @param {string} placeId - Supabase place ID
 * @param {string} googlePlaceId - Google Place ID
 * @param {Array} photos - Photos array from Google Places API
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
 * Process a batch of places
 * @param {Array} places - Array of place objects from Supabase
 */
async function processBatch(places) {
  const results = {
    processed: 0,
    found: 0,
    notFound: 0,
    errors: 0
  }

  for (const place of places) {
    try {
      console.log(`🔍 Searching for: ${place.name} in ${place.city}`)
      
      const { placeId, photos } = await searchGooglePlace(place.name, `${place.address}, ${place.city}`)
      
      if (placeId) {
        await updatePlaceInSupabase(place.id, placeId, photos)
        console.log(`✅ Found and updated: ${place.name} (${photos.length} photos)`)
        results.found++
      } else {
        console.log(`❌ Not found: ${place.name}`)
        results.notFound++
      }
      
      results.processed++
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY))
      
    } catch (error) {
      console.error(`💥 Error processing ${place.name}:`, error.message)
      results.errors++
    }
  }
  
  return results
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Google Places photo backfill...\n')
  
  try {
    // Get all places that don't have Google Place IDs
    const { data: places, error } = await supabase
      .from('places')
      .select('id, name, address, city')
      .is('google_place_id', null)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch places: ${error.message}`)
    }

    if (!places || places.length === 0) {
      console.log('✨ No places need updating. All places already have Google Place IDs!')
      return
    }

    console.log(`📋 Found ${places.length} places to process\n`)

    const totalResults = {
      processed: 0,
      found: 0,
      notFound: 0,
      errors: 0
    }

    // Process places in batches
    for (let i = 0; i < places.length; i += BATCH_SIZE) {
      const batch = places.slice(i, i + BATCH_SIZE)
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(places.length / BATCH_SIZE)
      
      console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} places)`)
      console.log('─'.repeat(50))
      
      const batchResults = await processBatch(batch)
      
      // Accumulate results
      totalResults.processed += batchResults.processed
      totalResults.found += batchResults.found
      totalResults.notFound += batchResults.notFound
      totalResults.errors += batchResults.errors
      
      // Progress update
      console.log(`\n📊 Batch ${batchNumber} results:`)
      console.log(`   ✅ Found: ${batchResults.found}`)
      console.log(`   ❌ Not found: ${batchResults.notFound}`)
      console.log(`   💥 Errors: ${batchResults.errors}`)
      
      // Delay between batches
      if (i + BATCH_SIZE < places.length) {
        console.log(`\n⏱️ Waiting 1 second before next batch...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Final summary
    console.log('\n' + '='.repeat(50))
    console.log('🎉 BACKFILL COMPLETE!')
    console.log('='.repeat(50))
    console.log(`📊 Final Results:`)
    console.log(`   📝 Total processed: ${totalResults.processed}`)
    console.log(`   ✅ Successfully found: ${totalResults.found}`)
    console.log(`   ❌ Not found: ${totalResults.notFound}`)
    console.log(`   💥 Errors: ${totalResults.errors}`)
    
    const successRate = totalResults.processed > 0 
      ? ((totalResults.found / totalResults.processed) * 100).toFixed(1)
      : '0'
    console.log(`   📈 Success rate: ${successRate}%`)

  } catch (error) {
    console.error('\n💥 Fatal error:', error.message)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Received SIGINT. Gracefully shutting down...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Received SIGTERM. Gracefully shutting down...')
  process.exit(0)
})

// Run the script
main().catch(error => {
  console.error('\n💥 Unhandled error:', error)
  process.exit(1)
})
#!/usr/bin/env node

/**
 * Fetch opening hours from Google Places API v1 for places that don't have them
 * Run with: node scripts/fetch-opening-hours.js
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
 * Convert Google's day number (0=Sunday) to our day names
 */
const GOOGLE_DAY_TO_NAME = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
}

/**
 * Fetch place details including opening hours from Google Places API v1
 */
async function fetchPlaceDetails(googlePlaceId) {
  try {
    // Ensure place ID has the 'places/' prefix for API v1
    const placeIdWithPrefix = googlePlaceId.startsWith('places/')
      ? googlePlaceId
      : `places/${googlePlaceId}`

    const response = await fetch(`${PLACES_API_BASE}/${placeIdWithPrefix}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,regularOpeningHours'
      }
    })

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`⚠️  Rate limit hit. Waiting...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        return null
      }
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.regularOpeningHours || null

  } catch (error) {
    console.error(`Error fetching place details:`, error.message)
    return null
  }
}

/**
 * Convert Google's opening hours format to our format
 */
function convertGoogleHoursToOurFormat(googleHours) {
  if (!googleHours || !googleHours.periods) {
    return null
  }

  // Initialize all days as closed
  const openingHours = {
    monday: { isOpen: false, openTime: null, closeTime: null },
    tuesday: { isOpen: false, openTime: null, closeTime: null },
    wednesday: { isOpen: false, openTime: null, closeTime: null },
    thursday: { isOpen: false, openTime: null, closeTime: null },
    friday: { isOpen: false, openTime: null, closeTime: null },
    saturday: { isOpen: false, openTime: null, closeTime: null },
    sunday: { isOpen: false, openTime: null, closeTime: null },
    specialNotes: null
  }

  // Process each period from Google
  for (const period of googleHours.periods) {
    if (!period.open) continue

    const dayName = GOOGLE_DAY_TO_NAME[period.open.day]
    if (!dayName) continue

    // Convert Google's time format (e.g., {hour: 9, minute: 0}) to "HH:MM"
    const openTime = `${String(period.open.hour).padStart(2, '0')}:${String(period.open.minute || 0).padStart(2, '0')}`

    let closeTime = '23:59' // Default if no close time
    if (period.close) {
      closeTime = `${String(period.close.hour).padStart(2, '0')}:${String(period.close.minute || 0).padStart(2, '0')}`
    }

    openingHours[dayName] = {
      isOpen: true,
      openTime,
      closeTime
    }
  }

  return openingHours
}

/**
 * Update place in Supabase with opening hours
 */
async function updatePlaceOpeningHours(placeId, openingHours) {
  const { error } = await supabase
    .from('places')
    .update({
      opening_hours: openingHours,
      hours_last_verified_at: new Date().toISOString()
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
  console.log('🚀 Fetching opening hours from Google Places API v1...\n')
  console.log('📝 Only updating places without existing opening hours\n')

  try {
    // Get places that don't have opening hours yet
    const { data: places, error } = await supabase
      .from('places')
      .select('id, name, google_place_id, opening_hours')
      .is('opening_hours', null)
      .not('google_place_id', 'is', null)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch places: ${error.message}`)
    }

    if (!places || places.length === 0) {
      console.log('✨ All places already have opening hours!')
      return
    }

    console.log(`📋 Found ${places.length} places needing opening hours\n`)

    const results = {
      processed: 0,
      success: 0,
      noHours: 0,
      errors: 0
    }

    // Process each place
    for (const place of places) {
      try {
        console.log(`🔍 [${results.processed + 1}/${places.length}] ${place.name}`)

        const googleHours = await fetchPlaceDetails(place.google_place_id)

        if (googleHours && googleHours.periods) {
          const openingHours = convertGoogleHoursToOurFormat(googleHours)

          if (openingHours) {
            await updatePlaceOpeningHours(place.id, openingHours)
            console.log(`   ✅ Updated with opening hours`)
            results.success++
          } else {
            console.log(`   ⚠️  Could not parse opening hours`)
            results.noHours++
          }
        } else {
          console.log(`   ⚠️  No opening hours available from Google`)
          results.noHours++
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
    console.log(`⚠️  No hours available: ${results.noHours}`)
    console.log(`💥 Errors: ${results.errors}`)
    console.log('═'.repeat(60))

    if (results.success > 0) {
      console.log('\n✨ Opening hours fetched successfully!')
      console.log('💡 Hours are now displaying in the frontend.')
    }

  } catch (error) {
    console.error('\n💥 Fatal error:', error.message)
    process.exit(1)
  }
}

// Run the script
main()

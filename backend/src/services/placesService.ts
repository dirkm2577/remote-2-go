import { supabase } from '../config/supabase'
import type { Place, PlaceFilters, PlaceSubmission } from '../types/Place'
import { GooglePlacesService } from './googlePlacesService'

export class PlacesService {
  private googlePlacesService: GooglePlacesService

  constructor() {
    this.googlePlacesService = new GooglePlacesService()
  }
  
  async getAllPlaces(filters?: PlaceFilters): Promise<Place[]> {
    try {
      let query = supabase!
        .from('places')
        .select('*')
        .eq('status', 'active')
        .eq('verified', true)

      if (filters?.visitType) {
        query = query.eq('visit_type', filters.visitType)
      }
      if (filters?.wifiQuality) {
        query = query.eq('wifi_quality', filters.wifiQuality)
      }
      if (filters?.noiseLevel) {
        query = query.eq('noise_level', filters.noiseLevel)
      }
      if (filters?.powerOutlets !== undefined) {
        query = query.eq('power_outlets', filters.powerOutlets)
      }
      if (filters?.priceLevel) {
        query = query.eq('price_level', filters.priceLevel)
      }
      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching places:', error)
      throw error
    }
  }

  async getPlaceById(id: string): Promise<Place | null> {
    try {
      const { data, error } = await supabase!
        .from('places')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .eq('verified', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error fetching place by ID:', error)
      throw error
    }
  }

  async submitPlace(placeData: any): Promise<Place> {
    try {
      const { data, error } = await supabase!
        .from('places')
        .insert([{
          ...placeData,
          status: 'pending',
          verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error submitting place:', error)
      throw error
    }
  }

  async getAllSubmissions(): Promise<Place[]> {
    try {
      const { data, error } = await supabase!
        .from('places')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching all submissions:', error)
      throw error
    }
  }

  async updatePlaceStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Place> {
    try {
      const placeStatus = status === 'approved' ? 'active' : status === 'rejected' ? 'archived' : 'pending'
      const { data, error } = await supabase!
        .from('places')
        .update({ 
          status: placeStatus,
          verified: status === 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error updating place status:', error)
      throw error
    }
  }



  async createPlace(submission: PlaceSubmission): Promise<Place> {
    const now = new Date().toISOString()
    
    // Helper function to validate enum values
    const validateEnum = <T extends string>(value: T | null | undefined, validValues: readonly T[], defaultValue: T): T => {
      if (value && validValues.includes(value)) {
        return value
      }
      return defaultValue
    }
    
    // Map submission fields to place fields with proper validation
    const placeData: Omit<Place, 'id'> = {
      name: submission.name,
      address: submission.address,
      city: submission.city,
      latitude: submission.latitude || 0,
      longitude: submission.longitude || 0,
      wifi_quality: validateEnum(submission.wifi_quality, ['excellent', 'good', 'fair', 'poor'] as const, 'fair') as Place['wifi_quality'],
      noise_level: validateEnum(submission.noise_level as any, ['quiet', 'moderate', 'noisy'] as const, 'moderate') as Place['noise_level'],
      time_limit: submission.time_limit,
      power_outlets: submission.power_outlets || false,
      price_level: validateEnum(submission.price_level as any, ['free', 'low', 'medium', 'high'] as const, 'medium') as Place['price_level'],
      visit_type: validateEnum(submission.visit_type, ['quick_stop', 'day_visit', 'multi_day'] as const, 'day_visit') as Place['visit_type'],
      amenities: submission.amenities || [],
      description: submission.description || '',
      status: 'active',
      verified: true,
      created_by: null, // Set to null since submitter_email is not a UUID
      created_at: now,
      updated_at: now,
      // Include the new photo columns
      google_place_id: null,
      photos: []
    }

    try {
      const { data, error } = await supabase!
        .from('places')
        .insert(placeData)
        .select()
        .single()

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // After successful place creation, fetch Google Places photos
      await this.fetchAndUpdatePhotos(data.id, data.name, data.address)

      return data
    } catch (error) {
      console.error('Error creating place:', error)
      throw error
    }
  }

  /**
   * Fetch Google Places photos and update the place record
   * This runs asynchronously after place creation and doesn't block the approval process
   */
  private async fetchAndUpdatePhotos(placeId: string, placeName: string, address: string): Promise<void> {
    try {
      console.log(`Fetching photos for place: ${placeName} (${placeId})`)
      
      // Fetch photos from Google Places API
      const photoData = await this.googlePlacesService.fetchPlacePhotos(placeName, address)
      
      if (photoData.google_place_id || photoData.photos.length > 0) {
        // Update the place with photo information
        const { error } = await supabase!
          .from('places')
          .update({
            google_place_id: photoData.google_place_id,
            photos: photoData.photos,
            updated_at: new Date().toISOString()
          })
          .eq('id', placeId)

        if (error) {
          console.error(`Error updating place ${placeId} with photos:`, error)
        } else {
          console.log(`Successfully updated place ${placeId} with ${photoData.photos.length} photos`)
        }
      } else {
        console.log(`No photos found for place: ${placeName}`)
      }
      
    } catch (error) {
      // Don't throw the error - we don't want photo fetch failures to block place creation
      console.error(`Error fetching photos for place ${placeId}:`, error)
    }
  }

}
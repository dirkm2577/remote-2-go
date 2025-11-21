import { supabase } from '../config/supabase'
import type { Place } from '../types/Place'

export interface PlaceWithDistance extends Place {
  distance_meters: number
}

export class LocationService {
  /**
   * Get places within a radius of a given location
   * Uses PostGIS spatial query for accurate distance calculation
   */
  async getPlacesNearby(
    lat: number,
    lng: number,
    radiusMeters: number = 5000
  ): Promise<PlaceWithDistance[]> {
    try {
      const { data, error } = await supabase!.rpc('places_within_radius', {
        user_lat: lat,
        user_lng: lng,
        radius_meters: radiusMeters
      })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching nearby places:', error)
      throw error
    }
  }

  /**
   * Get places within a bounding box
   * Used for map viewport queries
   */
  async getPlacesInBounds(
    neLat: number,
    neLng: number,
    swLat: number,
    swLng: number
  ): Promise<Place[]> {
    try {
      const { data, error } = await supabase!.rpc('places_in_bounds', {
        ne_lat: neLat,
        ne_lng: neLng,
        sw_lat: swLat,
        sw_lng: swLng
      })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching places in bounds:', error)
      throw error
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   * This is a utility method for client-side distance calculations
   * @returns Distance in meters
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const earthRadiusMeters = 6371000

    const toRadians = (degrees: number): number => {
      return degrees * (Math.PI / 180)
    }

    const dLat = toRadians(lat2 - lat1)
    const dLng = toRadians(lng2 - lng1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadiusMeters * c
  }
}

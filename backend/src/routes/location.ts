import { Router, Request, Response } from 'express'
import { LocationService } from '../services/locationService'

const router = Router()
const locationService = new LocationService()

// GET /api/places/nearby - Get places near a location
router.get('/places/nearby', async (req: Request, res: Response) => {
  try {
    const latParam = req.query.lat as string
    const lngParam = req.query.lng as string
    const radiusParam = req.query.radius as string

    // Validate required parameters
    if (!latParam || !lngParam) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: lat and lng are required'
      })
    }

    // Parse and validate coordinates
    const lat = parseFloat(latParam)
    const lng = parseFloat(lngParam)
    const radius = radiusParam ? parseInt(radiusParam, 10) : 5000

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameters: lat and lng must be valid numbers'
      })
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude: must be between -90 and 90'
      })
    }

    if (lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid longitude: must be between -180 and 180'
      })
    }

    // Validate radius
    if (radiusParam && (isNaN(radius) || radius <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid radius: must be a positive number'
      })
    }

    const places = await locationService.getPlacesNearby(lat, lng, radius)

    res.json({
      success: true,
      data: places,
      count: places.length,
      query: { lat, lng, radius }
    })
  } catch (error) {
    console.error('Error fetching nearby places:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// POST /api/places/within-bounds - Get places within a bounding box
router.post('/places/within-bounds', async (req: Request, res: Response) => {
  try {
    const { northEast, southWest } = req.body

    // Validate required parameters
    if (!northEast || !southWest) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: northEast and southWest bounds are required'
      })
    }

    if (
      typeof northEast.lat !== 'number' ||
      typeof northEast.lng !== 'number' ||
      typeof southWest.lat !== 'number' ||
      typeof southWest.lng !== 'number'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bounds: each bound must have numeric lat and lng properties'
      })
    }

    const { lat: neLat, lng: neLng } = northEast
    const { lat: swLat, lng: swLng } = southWest

    // Validate coordinate ranges
    if (neLat < -90 || neLat > 90 || swLat < -90 || swLat > 90) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude: must be between -90 and 90'
      })
    }

    if (neLng < -180 || neLng > 180 || swLng < -180 || swLng > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid longitude: must be between -180 and 180'
      })
    }

    // Validate that northEast is actually north and east of southWest
    if (neLat <= swLat) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bounds: northEast.lat must be greater than southWest.lat'
      })
    }

    // Note: longitude comparison is more complex due to antimeridian crossing
    // For simplicity, we'll handle the common case
    if (neLng <= swLng) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bounds: northEast.lng must be greater than southWest.lng'
      })
    }

    const places = await locationService.getPlacesInBounds(neLat, neLng, swLat, swLng)

    res.json({
      success: true,
      data: places,
      count: places.length,
      bounds: { northEast, southWest }
    })
  } catch (error) {
    console.error('Error fetching places in bounds:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router

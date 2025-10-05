import { Router, Request, Response } from 'express'
import { PlacesService } from '../services/placesService'

const router = Router()
const placesService = new PlacesService()

// GET /api/places - Get all places with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters = {
      visitType: req.query.visitType as string,
      wifiQuality: req.query.wifiQuality as string,
      noiseLevel: req.query.noiseLevel as string,
      powerOutlets: req.query.powerOutlets as string,
      priceLevel: req.query.priceLevel as string,
      city: req.query.city as string,
    }

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
    )

    const places = await placesService.getAllPlaces(cleanFilters)
    
    res.json({
      success: true,
      data: places,
      count: places.length
    })
  } catch (error) {
    console.error('Error fetching places:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// GET /api/places/:id - Get a single place by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const place = await placesService.getPlaceById(id)
    
    if (!place) {
      return res.status(404).json({
        success: false,
        error: 'Place not found'
      })
    }

    res.json({
      success: true,
      data: place
    })
  } catch (error) {
    console.error('Error fetching place:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
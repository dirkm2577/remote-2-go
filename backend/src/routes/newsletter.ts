import { Router, Request, Response } from 'express'
import { NewsletterService } from '../services/newsletterService'

const router = Router()
const newsletterService = new NewsletterService()

// POST /api/newsletter/signup - Subscribe to newsletter
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, interested_cities, signup_source, preferences } = req.body

    // Basic validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required'
      })
    }

    const signupData = {
      email: email.toLowerCase().trim(),
      interested_cities: interested_cities || ['Berlin'],
      signup_source: signup_source || 'unknown',
      preferences: preferences || {}
    }

    const signup = await newsletterService.createSignup(signupData)
    
    res.json({
      success: true,
      data: signup,
      message: 'Successfully subscribed to newsletter!'
    })
  } catch (error) {
    console.error('Error creating newsletter signup:', error)
    
    if (error instanceof Error && error.message.includes('already subscribed')) {
      return res.status(409).json({
        success: false,
        error: error.message
      })
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to newsletter. Please try again.'
    })
  }
})

// GET /api/newsletter/signups - Get all newsletter signups (admin only)
router.get('/signups', async (req: Request, res: Response) => {
  try {
    const signups = await newsletterService.getAllSignups()
    
    res.json({
      success: true,
      data: signups,
      count: signups.length
    })
  } catch (error) {
    console.error('Error fetching newsletter signups:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
import express from 'express'
import { adminAuth } from '../middleware/adminAuth'
import { PlacesService } from '../services/placesService'
import { PlaceSubmissionsService } from '../services/placeSubmissionsService'
import { NewsletterService } from '../services/newsletterService'
import { FeedbackService } from '../services/feedbackService'

const router = express.Router()
const placesService = new PlacesService()
const placeSubmissionsService = new PlaceSubmissionsService()
const newsletterService = new NewsletterService()
const feedbackService = new FeedbackService()

// Admin authentication endpoint
router.post('/auth', (req, res) => {
  const { password } = req.body
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  if (password === adminPassword) {
    res.json({ 
      success: true, 
      token: password,
      message: 'Admin authenticated successfully'
    })
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid admin password' 
    })
  }
})

// All subsequent routes require admin authentication
router.use(adminAuth)

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [places, submissions, newsletters, feedback] = await Promise.all([
      placesService.getAllPlaces(),
      placeSubmissionsService.getAllSubmissions(),
      newsletterService.getAllSubscriptions(),
      feedbackService.getAllFeedback()
    ])

    const stats = {
      totalPlaces: places.length,
      pendingPlaces: submissions.filter(p => p.status === 'pending').length,
      totalSubmissions: submissions.length,
      totalSubscribers: newsletters.length,
      totalFeedback: feedback.length,
      newFeedback: feedback.filter(f => f.status === 'new').length
    }

    res.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// Place management - approved places
router.get('/places', async (req, res) => {
  try {
    const places = await placesService.getAllPlaces()
    res.json(places)
  } catch (error) {
    console.error('Error fetching approved places for admin:', error)
    res.status(500).json({ error: 'Failed to fetch approved places' })
  }
})

// Update a place
router.patch('/places/:id', async (req, res) => {
  try {
    const { id } = req.params
    const placeData = req.body

    const updatedPlace = await placesService.updatePlace(id, placeData)
    res.json(updatedPlace)
  } catch (error) {
    console.error('Error updating place:', error)
    res.status(500).json({ error: 'Failed to update place' })
  }
})

// Place submissions management
router.get('/place-submissions', async (req, res) => {
  try {
    const submissions = await placeSubmissionsService.getAllSubmissions()
    res.json(submissions)
  } catch (error) {
    console.error('Error fetching place submissions for admin:', error)
    res.status(500).json({ error: 'Failed to fetch place submissions' })
  }
})

router.patch('/place-submissions/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    
    const updatedSubmission = await placeSubmissionsService.updateSubmissionStatus(id, status)
    res.json(updatedSubmission)
  } catch (error) {
    console.error('Error updating place submission status:', error)
    res.status(500).json({ error: 'Failed to update place submission status' })
  }
})

// Newsletter management
router.get('/newsletters', async (req, res) => {
  try {
    const subscriptions = await newsletterService.getAllSubscriptions()
    res.json(subscriptions)
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error)
    res.status(500).json({ error: 'Failed to fetch subscriptions' })
  }
})

router.delete('/newsletters/:id', async (req, res) => {
  try {
    const { id } = req.params
    await newsletterService.deleteSubscription(id)
    res.json({ success: true, message: 'Subscription deleted' })
  } catch (error) {
    console.error('Error deleting newsletter subscription:', error)
    res.status(500).json({ error: 'Failed to delete subscription' })
  }
})

// Feedback management
router.get('/feedback', async (req, res) => {
  try {
    const feedback = await feedbackService.getAllFeedback()
    res.json(feedback)
  } catch (error) {
    console.error('Error fetching feedback for admin:', error)
    res.status(500).json({ error: 'Failed to fetch feedback' })
  }
})

router.patch('/feedback/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    if (!['new', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    
    const updatedFeedback = await feedbackService.updateFeedbackStatus(id, status)
    res.json(updatedFeedback)
  } catch (error) {
    console.error('Error updating feedback status:', error)
    res.status(500).json({ error: 'Failed to update feedback status' })
  }
})

export default router
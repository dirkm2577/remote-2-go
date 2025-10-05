import { Router, Request, Response } from 'express'
import { FeedbackService } from '../services/feedbackService'

const router = Router()
const feedbackService = new FeedbackService()

// POST /api/feedback - Submit feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { feedback_type, message, contact_email, related_place_id } = req.body

    // Basic validation
    if (!feedback_type || !message) {
      return res.status(400).json({
        success: false,
        error: 'Feedback type and message are required'
      })
    }

    if (!['suggestion', 'bug_report', 'general'].includes(feedback_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feedback type. Must be: suggestion, bug_report, or general'
      })
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long'
      })
    }

    const feedbackData = {
      feedback_type,
      message: message.trim(),
      contact_email: contact_email?.trim() || undefined,
      related_place_id: related_place_id || undefined
    }

    const feedback = await feedbackService.createFeedback(feedbackData)
    
    res.json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully! Thank you for helping us improve.'
    })
  } catch (error) {
    console.error('Error creating feedback:', error)
    
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback. Please try again.'
    })
  }
})

// GET /api/feedback - Get all feedback (admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    const feedback = await feedbackService.getAllFeedback()
    
    res.json({
      success: true,
      data: feedback,
      count: feedback.length
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// PUT /api/feedback/:id/status - Update feedback status (admin only)
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['new', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: new, in_progress, or resolved'
      })
    }

    const feedback = await feedbackService.updateFeedbackStatus(id, status)
    
    res.json({
      success: true,
      data: feedback,
      message: 'Feedback status updated successfully'
    })
  } catch (error) {
    console.error('Error updating feedback status:', error)
    
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      })
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update feedback status'
    })
  }
})

export default router
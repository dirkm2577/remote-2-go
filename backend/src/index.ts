import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import placesRouter from './routes/places'
import placeSubmissionsRouter from './routes/placeSubmissions'
import newsletterRouter from './routes/newsletter'
import feedbackRouter from './routes/feedback'
import adminRouter from './routes/admin'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Remote2Go API is running!',
    version: '1.0.0',
    endpoints: {
      places: '/api/places',
      newsletter: '/api/newsletter',
      feedback: '/api/feedback',
      admin: '/api/admin',
      health: '/health'
    }
  })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/places', placesRouter)
app.use('/api/place-submissions', placeSubmissionsRouter)
app.use('/api/newsletter', newsletterRouter)
app.use('/api/feedback', feedbackRouter)
app.use('/api/admin', adminRouter)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
  console.log(`🗺️  Places API: http://localhost:${PORT}/api/places`)
})
export interface Place {
  id: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  wifi_quality: 'excellent' | 'good' | 'fair' | 'poor'
  noise_level: 'quiet' | 'moderate' | 'noisy'
  time_limit: number | null // in minutes
  power_outlets: boolean
  price_level: 'free' | 'low' | 'medium' | 'high'
  visit_type: 'quick_stop' | 'day_visit' | 'multi_day'
  amenities: string[]
  description: string
  status: 'active' | 'pending' | 'archived'
  verified: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  // Google Places API integration
  google_place_id: string | null
  photos: any[] // Array of photo objects from Google Places API
}

export interface PlaceFilters {
  visitType?: string
  wifiQuality?: string
  noiseLevel?: string
  powerOutlets?: boolean
  priceLevel?: string
  city?: string
}

export interface PlaceSubmission {
  id?: string
  name: string
  address: string
  city: string
  latitude?: number | null
  longitude?: number | null
  wifi_quality?: string | null
  noise_level?: string | null
  time_limit?: number | null
  power_outlets?: boolean | null
  price_level?: string | null
  visit_type?: string | null
  amenities?: string[] | null
  description?: string | null
  submitter_email?: string | null
  submitter_name?: string | null
  submission_source?: string
  status?: 'pending' | 'approved' | 'rejected'
  admin_notes?: string | null
  created_at?: string
}

export interface NewsletterSignup {
  id?: string
  email: string
  interested_cities?: string[]
  signup_source?: string | null
  preferences?: Record<string, any>
  confirmed_at?: string | null
  created_at?: string
}

export interface UserFeedback {
  id?: string
  feedback_type: 'suggestion' | 'bug_report' | 'general'
  message: string
  contact_email?: string | null
  related_place_id?: string | null
  status?: 'new' | 'in_progress' | 'resolved'
  created_at?: string
}
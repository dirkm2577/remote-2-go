export interface UserFeedback {
  id: string
  feedback_type: 'suggestion' | 'bug_report' | 'general'
  message: string
  contact_email?: string
  related_place_id?: string
  status: 'new' | 'in_progress' | 'resolved'
  created_at: string
}

export interface FeedbackRequest {
  feedback_type: 'suggestion' | 'bug_report' | 'general'
  message: string
  contact_email?: string
  related_place_id?: string
}
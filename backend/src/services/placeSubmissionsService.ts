import { supabase } from '../config/supabase'
import type { PlaceSubmission } from '../types/Place'
import { PlacesService } from './placesService'

export class PlaceSubmissionsService {
  private placesService: PlacesService

  constructor() {
    this.placesService = new PlacesService()
  }
  
  async createSubmission(submissionData: Partial<PlaceSubmission>): Promise<PlaceSubmission> {
    try {
      const { error } = await supabase!
        .from('place_submissions')
        .insert([{
          name: submissionData.name,
          address: submissionData.address,
          city: submissionData.city,
          latitude: submissionData.latitude || null,
          longitude: submissionData.longitude || null,
          wifi_quality: submissionData.wifi_quality || null,
          noise_level: submissionData.noise_level || null,
          time_limit: submissionData.time_limit || null,
          power_outlets: submissionData.power_outlets || null,
          price_level: submissionData.price_level || null,
          visit_type: submissionData.visit_type || null,
          amenities: submissionData.amenities || null,
          description: submissionData.description || null,
          opening_hours: submissionData.opening_hours || null,
          submitter_email: submissionData.submitter_email || null,
          submitter_name: submissionData.submitter_name || null,
          submission_source: submissionData.submission_source || 'web_form',
          status: 'pending'
        }])

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // Return a success response without fetching the inserted data
      // This avoids RLS SELECT permission issues
      return {
        id: `submission-${Date.now()}`, // Generate a temporary ID for response
        name: submissionData.name || '',
        address: submissionData.address || '',
        city: submissionData.city || '',
        latitude: submissionData.latitude || null,
        longitude: submissionData.longitude || null,
        wifi_quality: submissionData.wifi_quality || null,
        noise_level: submissionData.noise_level || null,
        time_limit: submissionData.time_limit || null,
        power_outlets: submissionData.power_outlets || null,
        price_level: submissionData.price_level || null,
        visit_type: submissionData.visit_type || null,
        amenities: submissionData.amenities || null,
        description: submissionData.description || null,
        opening_hours: submissionData.opening_hours || null,
        submitter_email: submissionData.submitter_email || null,
        submitter_name: submissionData.submitter_name || null,
        submission_source: submissionData.submission_source || 'web_form',
        status: 'pending',
        admin_notes: null,
        created_at: new Date().toISOString()
      } as PlaceSubmission
    } catch (error) {
      console.error('Error creating place submission:', error)
      throw error
    }
  }

  async getAllSubmissions(): Promise<PlaceSubmission[]> {
    try {
      const { data, error } = await supabase!
        .from('place_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching place submissions:', error)
      throw error
    }
  }

  async updateSubmissionStatus(id: string, status: 'pending' | 'approved' | 'rejected', adminNotes?: string): Promise<PlaceSubmission> {
    try {
      // First, get the current submission
      const { data: submission, error: fetchError } = await supabase!
        .from('place_submissions')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !submission) {
        throw new Error(`Failed to fetch submission: ${fetchError?.message || 'Not found'}`)
      }

      // Update the submission status
      const { data: updatedSubmission, error: updateError } = await supabase!
        .from('place_submissions')
        .update({ 
          status,
          admin_notes: adminNotes || null 
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Database error: ${updateError.message}`)
      }

      // If approving, create a place in the places table
      if (status === 'approved') {
        try {
          await this.placesService.createPlace(submission)
          console.log(`Successfully promoted submission ${id} to places table`)
        } catch (placeError) {
          console.error('Error creating place, but submission was updated:', placeError)
          // Note: We don't rollback the submission status change here
          // The submission stays approved, admin can see the issue and retry if needed
        }
      }

      return updatedSubmission
    } catch (error) {
      console.error('Error updating submission status:', error)
      throw error
    }
  }

}
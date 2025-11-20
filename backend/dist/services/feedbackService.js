"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const supabase_1 = require("../config/supabase");
class FeedbackService {
    async createFeedback(feedbackData) {
        try {
            const { error } = await supabase_1.supabase
                .from('user_feedback')
                .insert([{
                    feedback_type: feedbackData.feedback_type,
                    message: feedbackData.message,
                    contact_email: feedbackData.contact_email || null,
                    related_place_id: feedbackData.related_place_id || null,
                    status: 'new'
                }]);
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return {
                id: `feedback-${Date.now()}`,
                feedback_type: feedbackData.feedback_type,
                message: feedbackData.message,
                contact_email: feedbackData.contact_email || undefined,
                related_place_id: feedbackData.related_place_id || undefined,
                status: 'new',
                created_at: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('Error creating feedback:', error);
            throw error;
        }
    }
    async getAllFeedback() {
        try {
            const { data, error } = await supabase_1.supabase
                .from('user_feedback')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return data || [];
        }
        catch (error) {
            console.error('Error fetching feedback:', error);
            throw error;
        }
    }
    async updateFeedbackStatus(id, status) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('user_feedback')
                .update({ status })
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('Error updating feedback status:', error);
            throw error;
        }
    }
}
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedbackService.js.map
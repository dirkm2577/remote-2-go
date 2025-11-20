"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const supabase_1 = require("../config/supabase");
class NewsletterService {
    async createSignup(signupData) {
        try {
            const { error } = await supabase_1.supabase
                .from('newsletter_signups')
                .insert([{
                    email: signupData.email,
                    interested_cities: signupData.interested_cities || ['Berlin'],
                    signup_source: signupData.signup_source || 'unknown',
                    preferences: signupData.preferences || {}
                }]);
            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    throw new Error('This email is already subscribed to our newsletter.');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            return {
                id: `newsletter-${Date.now()}`,
                email: signupData.email,
                interested_cities: signupData.interested_cities || ['Berlin'],
                signup_source: signupData.signup_source || 'unknown',
                preferences: signupData.preferences || {},
                confirmed_at: null,
                created_at: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('Error creating newsletter signup:', error);
            throw error;
        }
    }
    async getAllSignups() {
        try {
            const { data, error } = await supabase_1.supabase
                .from('newsletter_signups')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return data || [];
        }
        catch (error) {
            console.error('Error fetching newsletter signups:', error);
            throw error;
        }
    }
    async getAllSubscriptions() {
        return this.getAllSignups();
    }
    async deleteSubscription(id) {
        try {
            const { error } = await supabase_1.supabase
                .from('newsletter_signups')
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
        }
        catch (error) {
            console.error('Error deleting subscription:', error);
            throw error;
        }
    }
}
exports.NewsletterService = NewsletterService;
//# sourceMappingURL=newsletterService.js.map
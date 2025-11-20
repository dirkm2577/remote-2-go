export interface NewsletterSignup {
    id: string;
    email: string;
    interested_cities: string[];
    signup_source?: string;
    preferences?: Record<string, any>;
    confirmed_at?: string | null;
    created_at: string;
}
export interface NewsletterSignupRequest {
    email: string;
    interested_cities?: string[];
    signup_source?: string;
    preferences?: Record<string, any>;
}

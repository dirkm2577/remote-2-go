import type { NewsletterSignup, NewsletterSignupRequest } from '../types/Newsletter';
export declare class NewsletterService {
    createSignup(signupData: NewsletterSignupRequest): Promise<NewsletterSignup>;
    getAllSignups(): Promise<NewsletterSignup[]>;
    getAllSubscriptions(): Promise<NewsletterSignup[]>;
    deleteSubscription(id: string): Promise<void>;
}

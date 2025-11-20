import type { UserFeedback, FeedbackRequest } from '../types/Feedback';
export declare class FeedbackService {
    createFeedback(feedbackData: FeedbackRequest): Promise<UserFeedback>;
    getAllFeedback(): Promise<UserFeedback[]>;
    updateFeedbackStatus(id: string, status: 'new' | 'in_progress' | 'resolved'): Promise<UserFeedback>;
}

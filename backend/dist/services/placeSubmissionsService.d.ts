import type { PlaceSubmission } from '../types/Place';
export declare class PlaceSubmissionsService {
    private placesService;
    constructor();
    createSubmission(submissionData: Partial<PlaceSubmission>): Promise<PlaceSubmission>;
    getAllSubmissions(): Promise<PlaceSubmission[]>;
    updateSubmissionStatus(id: string, status: 'pending' | 'approved' | 'rejected', adminNotes?: string): Promise<PlaceSubmission>;
}

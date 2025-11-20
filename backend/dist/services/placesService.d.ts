import type { Place, PlaceFilters, PlaceSubmission } from '../types/Place';
export declare class PlacesService {
    private googlePlacesService;
    constructor();
    getAllPlaces(filters?: PlaceFilters): Promise<Place[]>;
    getPlaceById(id: string): Promise<Place | null>;
    submitPlace(placeData: any): Promise<Place>;
    getAllSubmissions(): Promise<Place[]>;
    updatePlaceStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Place>;
    createPlace(submission: PlaceSubmission): Promise<Place>;
    /**
     * Update an existing place
     */
    updatePlace(id: string, placeData: Partial<Place>): Promise<Place>;
    /**
     * Fetch Google Places data (photos and location) and update the place record
     * This runs asynchronously after place creation and doesn't block the approval process
     */
    private fetchAndUpdatePhotos;
}

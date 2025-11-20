/**
 * Google Places API Service for backend
 * Uses the new Google Places API (v1) to fetch place photos and data
 */
export interface GooglePlacePhoto {
    name: string;
    widthPx: number;
    heightPx: number;
    authorAttributions?: {
        displayName: string;
        uri?: string;
        photoUri?: string;
    }[];
}
export interface GooglePlaceResult {
    placeId: string | null;
    latitude: number | null;
    longitude: number | null;
    photos: GooglePlacePhoto[];
}
export declare class GooglePlacesService {
    private readonly apiKey;
    private readonly apiBase;
    constructor();
    /**
     * Check if the Google Places API is properly configured
     */
    isConfigured(): boolean;
    /**
     * Find Google Place ID and photos for a given place name and address
     */
    findPlaceId(placeName: string, address: string): Promise<GooglePlaceResult>;
    /**
     * Process photos array to generate photo URLs for storage
     * Note: We store the photo names, not the full URLs since URLs include API keys
     */
    processPhotosForStorage(photos: GooglePlacePhoto[]): any[];
    /**
     * Fetch place photos and location data, return processed data ready for database storage
     */
    fetchPlacePhotos(placeName: string, address: string): Promise<{
        google_place_id: string | null;
        latitude: number | null;
        longitude: number | null;
        photos: any[];
    }>;
}

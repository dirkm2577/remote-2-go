"use strict";
/**
 * Google Places API Service for backend
 * Uses the new Google Places API (v1) to fetch place photos and data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooglePlacesService = void 0;
class GooglePlacesService {
    apiKey;
    apiBase = 'https://places.googleapis.com/v1';
    constructor() {
        this.apiKey = process.env.GOOGLE_PLACES_API_KEY || '';
        if (!this.apiKey) {
            console.warn('Google Places API key not configured');
        }
    }
    /**
     * Check if the Google Places API is properly configured
     */
    isConfigured() {
        return !!this.apiKey;
    }
    /**
     * Find Google Place ID and photos for a given place name and address
     */
    async findPlaceId(placeName, address) {
        if (!this.isConfigured()) {
            console.warn('Google Places API not configured, returning empty result');
            return {
                placeId: null,
                latitude: null,
                longitude: null,
                photos: []
            };
        }
        try {
            const searchQuery = `${placeName} ${address}`.trim();
            const response = await fetch(`${this.apiBase}/places:searchText`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': this.apiKey,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.photos'
                },
                body: JSON.stringify({
                    textQuery: searchQuery,
                    maxResultCount: 1
                })
            });
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Google Places API quota exceeded. Please try again later.');
                }
                throw new Error(`Google Places API error: ${response.status}`);
            }
            const data = await response.json();
            if (!data.places || data.places.length === 0) {
                return {
                    placeId: null,
                    latitude: null,
                    longitude: null,
                    photos: []
                };
            }
            const place = data.places[0];
            return {
                placeId: place.id,
                latitude: place.location?.latitude || null,
                longitude: place.location?.longitude || null,
                photos: place.photos || []
            };
        }
        catch (error) {
            console.error('Error finding place ID:', error);
            return {
                placeId: null,
                latitude: null,
                longitude: null,
                photos: []
            };
        }
    }
    /**
     * Process photos array to generate photo URLs for storage
     * Note: We store the photo names, not the full URLs since URLs include API keys
     */
    processPhotosForStorage(photos) {
        if (!photos || !Array.isArray(photos)) {
            return [];
        }
        return photos.map(photo => ({
            name: photo.name,
            widthPx: photo.widthPx,
            heightPx: photo.heightPx,
            attribution: photo.authorAttributions?.[0]?.displayName || 'Unknown'
        }));
    }
    /**
     * Fetch place photos and location data, return processed data ready for database storage
     */
    async fetchPlacePhotos(placeName, address) {
        try {
            console.log(`Fetching Google Places data for: ${placeName}, ${address}`);
            const result = await this.findPlaceId(placeName, address);
            const processedPhotos = this.processPhotosForStorage(result.photos);
            console.log(`Found ${processedPhotos.length} photos and location (${result.latitude}, ${result.longitude}) for ${placeName}`);
            return {
                google_place_id: result.placeId,
                latitude: result.latitude,
                longitude: result.longitude,
                photos: processedPhotos
            };
        }
        catch (error) {
            console.error('Error fetching place data:', error);
            return {
                google_place_id: null,
                latitude: null,
                longitude: null,
                photos: []
            };
        }
    }
}
exports.GooglePlacesService = GooglePlacesService;
//# sourceMappingURL=googlePlacesService.js.map
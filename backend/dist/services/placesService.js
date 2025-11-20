"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesService = void 0;
const supabase_1 = require("../config/supabase");
const googlePlacesService_1 = require("./googlePlacesService");
class PlacesService {
    googlePlacesService;
    constructor() {
        this.googlePlacesService = new googlePlacesService_1.GooglePlacesService();
    }
    async getAllPlaces(filters) {
        try {
            let query = supabase_1.supabase
                .from('places')
                .select('*')
                .eq('status', 'active')
                .eq('verified', true);
            if (filters?.visitType) {
                query = query.eq('visit_type', filters.visitType);
            }
            if (filters?.wifiQuality) {
                query = query.eq('wifi_quality', filters.wifiQuality);
            }
            if (filters?.noiseLevel) {
                query = query.eq('noise_level', filters.noiseLevel);
            }
            if (filters?.powerOutlets !== undefined) {
                query = query.eq('power_outlets', filters.powerOutlets);
            }
            if (filters?.priceLevel) {
                query = query.eq('price_level', filters.priceLevel);
            }
            if (filters?.city) {
                query = query.ilike('city', `%${filters.city}%`);
            }
            const { data, error } = await query;
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return data || [];
        }
        catch (error) {
            console.error('Error fetching places:', error);
            throw error;
        }
    }
    async getPlaceById(id) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('places')
                .select('*')
                .eq('id', id)
                .eq('status', 'active')
                .eq('verified', true)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // No rows found
                }
                throw new Error(`Database error: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('Error fetching place by ID:', error);
            throw error;
        }
    }
    async submitPlace(placeData) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('places')
                .insert([{
                    ...placeData,
                    status: 'pending',
                    verified: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('Error submitting place:', error);
            throw error;
        }
    }
    async getAllSubmissions() {
        try {
            const { data, error } = await supabase_1.supabase
                .from('places')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return data || [];
        }
        catch (error) {
            console.error('Error fetching all submissions:', error);
            throw error;
        }
    }
    async updatePlaceStatus(id, status) {
        try {
            const placeStatus = status === 'approved' ? 'active' : status === 'rejected' ? 'archived' : 'pending';
            const { data, error } = await supabase_1.supabase
                .from('places')
                .update({
                status: placeStatus,
                verified: status === 'approved',
                updated_at: new Date().toISOString()
            })
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('Error updating place status:', error);
            throw error;
        }
    }
    async createPlace(submission) {
        const now = new Date().toISOString();
        // Helper function to validate enum values
        const validateEnum = (value, validValues, defaultValue) => {
            if (value && validValues.includes(value)) {
                return value;
            }
            return defaultValue;
        };
        // Map submission fields to place fields with proper validation
        const placeData = {
            name: submission.name,
            address: submission.address,
            city: submission.city,
            latitude: submission.latitude || 0,
            longitude: submission.longitude || 0,
            wifi_quality: validateEnum(submission.wifi_quality, ['excellent', 'good', 'fair', 'poor'], 'fair'),
            noise_level: validateEnum(submission.noise_level, ['quiet', 'moderate', 'noisy'], 'moderate'),
            time_limit: submission.time_limit,
            power_outlets: submission.power_outlets || false,
            price_level: validateEnum(submission.price_level, ['free', 'low', 'medium', 'high'], 'medium'),
            visit_type: validateEnum(submission.visit_type, ['quick_stop', 'day_visit', 'multi_day'], 'day_visit'),
            amenities: submission.amenities || [],
            description: submission.description || '',
            status: 'active',
            verified: true,
            created_by: null, // Set to null since submitter_email is not a UUID
            created_at: now,
            updated_at: now,
            // Include the new photo columns
            google_place_id: null,
            photos: [],
            // Include the new opening hours columns
            opening_hours: submission.opening_hours || null,
            hours_last_verified_at: submission.opening_hours ? now : null
        };
        try {
            const { data, error } = await supabase_1.supabase
                .from('places')
                .insert(placeData)
                .select()
                .single();
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            // After successful place creation, fetch Google Places photos
            await this.fetchAndUpdatePhotos(data.id, data.name, data.address);
            return data;
        }
        catch (error) {
            console.error('Error creating place:', error);
            throw error;
        }
    }
    /**
     * Update an existing place
     */
    async updatePlace(id, placeData) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('places')
                .update({
                ...placeData,
                updated_at: new Date().toISOString()
            })
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new Error(`Database error: ${error.message}`);
            }
            return data;
        }
        catch (error) {
            console.error('Error updating place:', error);
            throw error;
        }
    }
    /**
     * Fetch Google Places data (photos and location) and update the place record
     * This runs asynchronously after place creation and doesn't block the approval process
     */
    async fetchAndUpdatePhotos(placeId, placeName, address) {
        try {
            console.log(`Fetching Google Places data for: ${placeName} (${placeId})`);
            // Fetch photos and location from Google Places API
            const placeData = await this.googlePlacesService.fetchPlacePhotos(placeName, address);
            const hasData = placeData.google_place_id || placeData.photos.length > 0 || placeData.latitude !== null;
            if (hasData) {
                // Build update payload
                const updatePayload = {
                    google_place_id: placeData.google_place_id,
                    photos: placeData.photos,
                    updated_at: new Date().toISOString()
                };
                // Update coordinates if available from Google Places
                if (placeData.latitude !== null && placeData.longitude !== null) {
                    updatePayload.latitude = placeData.latitude;
                    updatePayload.longitude = placeData.longitude;
                    console.log(`Found coordinates for ${placeName}: (${placeData.latitude}, ${placeData.longitude})`);
                }
                // Update the place with Google Places data
                const { error } = await supabase_1.supabase
                    .from('places')
                    .update(updatePayload)
                    .eq('id', placeId);
                if (error) {
                    console.error(`Error updating place ${placeId} with Google data:`, error);
                }
                else {
                    console.log(`Successfully updated place ${placeId} with ${placeData.photos.length} photos and location data`);
                }
            }
            else {
                console.log(`No Google Places data found for: ${placeName}`);
            }
        }
        catch (error) {
            // Don't throw the error - we don't want Google Places fetch failures to block place creation
            console.error(`Error fetching Google data for place ${placeId}:`, error);
        }
    }
}
exports.PlacesService = PlacesService;
//# sourceMappingURL=placesService.js.map
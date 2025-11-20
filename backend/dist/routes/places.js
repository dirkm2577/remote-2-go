"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const placesService_1 = require("../services/placesService");
const router = (0, express_1.Router)();
const placesService = new placesService_1.PlacesService();
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const PLACES_API_BASE = 'https://places.googleapis.com/v1';
// Legacy Places API for photos - more reliable
const LEGACY_PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';
// GET /api/places - Get all places with optional filters
router.get('/', async (req, res) => {
    try {
        const filters = {
            visitType: req.query.visitType,
            wifiQuality: req.query.wifiQuality,
            noiseLevel: req.query.noiseLevel,
            powerOutlets: req.query.powerOutlets,
            priceLevel: req.query.priceLevel,
            city: req.query.city,
        };
        // Remove undefined values
        const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ''));
        const places = await placesService.getAllPlaces(cleanFilters);
        res.json({
            success: true,
            data: places,
            count: places.length
        });
    }
    catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/places/photo - Proxy Google Places photos via query parameter
// This endpoint proxies photo requests to avoid CORS issues
// Usage: /api/places/photo?reference=PHOTO_REFERENCE&maxwidth=800
// Uses Legacy Places API for photo fetching
router.get('/photo', async (req, res) => {
    try {
        // Support both 'reference' (new format) and 'name' (backward compatibility)
        let photoReference = req.query.reference;
        const photoName = req.query.name;
        const maxwidth = req.query.maxwidth || req.query.maxWidthPx || '800';
        // If 'name' is provided (old format), extract reference from it
        if (!photoReference && photoName) {
            // Try to extract from new API format: "places/{placeId}/photos/{photoReference}"
            if (photoName.includes('/photos/')) {
                photoReference = photoName.split('/photos/')[1];
            }
            else {
                photoReference = photoName;
            }
        }
        if (!photoReference) {
            return res.status(400).json({
                success: false,
                error: 'Photo reference is required (use ?reference=PHOTO_REF or ?name=...)'
            });
        }
        if (!GOOGLE_PLACES_API_KEY) {
            return res.status(500).json({
                success: false,
                error: 'Google Places API key not configured'
            });
        }
        // Use Legacy Places API photo endpoint
        const photoUrl = `${LEGACY_PLACES_API_BASE}/photo?photoreference=${encodeURIComponent(photoReference)}&maxwidth=${maxwidth}&key=${GOOGLE_PLACES_API_KEY}`;
        console.log(`Fetching photo using Legacy API (reference: ${photoReference.substring(0, 30)}...)`);
        // Fetch the photo from Google Places API (Legacy)
        const response = await fetch(photoUrl);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching photo: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({
                success: false,
                error: `Failed to fetch photo: ${response.statusText}`,
                details: errorText.substring(0, 200)
            });
        }
        // Get the image buffer
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        // Set appropriate headers
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        // Send the image
        res.send(Buffer.from(imageBuffer));
    }
    catch (error) {
        console.error('Error proxying photo:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/places/:id - Get a single place by ID
// IMPORTANT: This route must come AFTER the /photo route
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const place = await placesService.getPlaceById(id);
        if (!place) {
            return res.status(404).json({
                success: false,
                error: 'Place not found'
            });
        }
        res.json({
            success: true,
            data: place
        });
    }
    catch (error) {
        console.error('Error fetching place:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=places.js.map
# Google Places API Photo Integration - Implementation Request

I need to integrate Google Places API photos into my Vue 3 app for displaying place images. Here's the context:

## Current Setup
- Vue 3 app with Vite
- Supabase backend (already configured)
- Google Places API key: [AIzaSyAcj1AqfTUqBd0XMBorfKmqDy5DzsuE8-4]
- Domain: remote2go.io
- Project structure follows standard Vue 3 conventions

## Database Schema (Supabase)
My `places` table currently has these columns (as you know from the previous phases):
- id (uuid)
- name (text)
- address (text)
- city (text)
- lat (float)
- lng (float)
- wifi_quality (text)
- noise_level (text)
- time_limit (text)
- power_outlets (boolean)
- visit_type (enum)
- amenities (text)
- description (text)
- status (text)
- verified (boolean)
- created_by (uuid)
- created_at (timestamp)

## What I Need You To Do

### 1. Update Database Schema
Add these columns to the `places` table:
- `google_place_id` (varchar/text) - to store Google's place ID
- `photos` (jsonb) - to store array of photo objects with structure:
```json
[
  {
    "name": "places/ChIJ.../photos/AW30...",
    "widthPx": 4032,
    "heightPx": 3024,
    "authorAttributions": [{"displayName": "John Doe"}]
  }
]
```

### 2. Create Composable
Create `src/composables/useGooglePlaces.js` with these functions:
- `findPlaceId(placeName, address)` - searches Google Places API and returns place ID + photos
- `getPhotoUrl(photoName, maxWidth)` - generates photo URL from photo name
- `getPhotoUrls(photos, maxWidth)` - processes array of photos into URLs with attributions

Use the new Google Places API (New) with these endpoints:
- Search: `https://places.googleapis.com/v1/places:searchText`
- Photos: `https://places.googleapis.com/v1/{photoName}/media?maxWidthPx={width}&key={API_KEY}`

Required headers for search:
```javascript
{
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': API_KEY,
  'X-Goog-FieldMask': 'places.id,places.displayName,places.photos'
}
```

### 3. Create Photo Gallery Component
Create `src/components/PlacePhotoGallery.vue` with:
- Main photo display (16:9 aspect ratio)
- Navigation arrows for multiple photos (previous/next)
- Thumbnail strip below main photo
- Photo counter badge (e.g., "2 / 5")
- Click to open lightbox/modal with larger view
- **REQUIRED: Google attribution overlay** with:
  - Google logo (use: `https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png`)
  - Photographer name from `authorAttributions[0].displayName`
  - Overlay at bottom of image with semi-transparent dark background
- Fallback placeholder when no photos available (generic icon + "No photos available")
- Mobile responsive design

Props:
- `place` (Object, required) - the place object with photos array
- `maxPhotos` (Number, default: 5) - limit number of photos to display

Style with Tailwind CSS classes.

### 4. Environment Variables
Set up `.env` file with:
```
VITE_GOOGLE_PLACES_API_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

Make sure to add `.env` to `.gitignore`.

### 5. Integration Point
Show me how to use the component in a place detail page. Assume I have a page that loads place data from Supabase and displays it.

### 6. Backfill Script (Optional)
Create a Node.js script `scripts/fetch-place-photos.js` that:
- Fetches all places from Supabase that don't have `google_place_id`
- For each place, searches Google Places API
- Updates the database with `google_place_id` and `photos` array
- Includes rate limiting (100ms delay between requests)
- Shows progress in console

## Important Requirements
✅ All Google Places API usage must include proper attribution (Google logo + photographer)
✅ Use the NEW Places API (v1), not the legacy API
✅ Don't cache/store actual image files, only photo references
✅ Handle loading states and errors gracefully
✅ Make it mobile-responsive
✅ Follow Vue 3 Composition API best practices
✅ Include proper TypeScript/JSDoc comments for clarity

## Legal Compliance
- Must display Google logo with every photo (required by Google's ToS)
- Must display photographer attribution when available
- Must use official API, no scraping
- Photos generated dynamically via URL, not downloaded/stored

Please create all necessary files with complete, production-ready code. Include comments explaining key parts.

---

## Additional Tasks

Please also:
1. Show me the exact SQL migration to run in Supabase
2. Verify the Google Places API call works by creating a test file I can run
3. Add error handling for when API quota is exceeded
4. Make sure the photo gallery works offline (shows cached references, generates URLs on-demand)
5. Provide a complete implementation checklist for me to follow

---

## Expected Deliverables

- [ ] SQL migration file for Supabase
- [ ] `src/composables/useGooglePlaces.js`
- [ ] `src/components/PlacePhotoGallery.vue`
- [ ] `.env.example` template
- [ ] `scripts/fetch-place-photos.js` (backfill script)
- [ ] `scripts/test-google-api.js` (test/verification script)
- [ ] Integration example code
- [ ] Implementation checklist/README

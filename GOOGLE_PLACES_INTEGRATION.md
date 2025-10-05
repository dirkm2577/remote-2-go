# Google Places API Photo Integration Guide

This guide provides complete implementation instructions for integrating Google Places API photos into your Vue 3 application.

## 📋 Implementation Checklist

### Phase 1: Database Setup
- [ ] **Run SQL Migration**
  ```bash
  # In Supabase SQL Editor, run:
  # database/google_places_migration.sql
  ```
  - Adds `google_place_id` column (VARCHAR)
  - Adds `photos` column (JSONB)
  - Creates performance indexes

### Phase 2: Environment Configuration
- [ ] **Set up API Key**
  ```bash
  # Copy environment template
  cp .env.example .env.local
  
  # Add your Google Places API key
  VITE_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
  ```

- [ ] **Verify API Key Setup**
  ```bash
  # Test the API connection
  node scripts/test-google-api.js
  ```

### Phase 3: Install Dependencies
- [ ] **Add required packages** (if not already installed)
  ```bash
  cd frontend
  npm install node-fetch @supabase/supabase-js dotenv
  ```

### Phase 4: Integration
- [ ] **Import and use the photo gallery component**
- [ ] **Test with existing places data**
- [ ] **Run backfill script for existing places**

### Phase 5: Verification
- [ ] **Test photo display in development**
- [ ] **Verify Google attribution is visible**
- [ ] **Test mobile responsiveness**
- [ ] **Test error handling (no photos, API failure)**

## 🔧 Integration Example

### Basic Usage in a Vue Component

```vue
<template>
  <div class="place-detail-page">
    <!-- Place information -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold">{{ place.name }}</h1>
      <p class="text-gray-600">{{ place.address }}</p>
    </div>

    <!-- Photo Gallery -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Photos</h2>
      <PlacePhotoGallery 
        :place="place" 
        :max-photos="5"
        class="rounded-lg shadow-md"
      />
    </div>

    <!-- Rest of your place details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Place details content -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { createClient } from '@supabase/supabase-js'
import PlacePhotoGallery from '@/components/PlacePhotoGallery.vue'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default {
  name: 'PlaceDetailView',
  components: {
    PlacePhotoGallery
  },
  setup() {
    const route = useRoute()
    const place = ref(null)
    const loading = ref(true)
    const error = ref(null)

    async function fetchPlace() {
      try {
        const { data, error: fetchError } = await supabase
          .from('places')
          .select('*')
          .eq('id', route.params.id)
          .single()

        if (fetchError) throw fetchError
        
        place.value = data
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchPlace()
    })

    return {
      place,
      loading,
      error
    }
  }
}
</script>
```

### Advanced Usage with Manual Photo Fetching

```vue
<template>
  <div class="place-form">
    <!-- Place form fields -->
    <div class="space-y-4">
      <input v-model="placeName" placeholder="Place name" />
      <input v-model="placeAddress" placeholder="Address" />
      
      <!-- Fetch photos button -->
      <button 
        @click="fetchPhotosForPlace"
        :disabled="googlePlacesLoading"
        class="btn btn-secondary"
      >
        {{ googlePlacesLoading ? 'Fetching Photos...' : 'Fetch Photos from Google' }}
      </button>
    </div>

    <!-- Preview fetched photos -->
    <div v-if="fetchedPhotos.length > 0" class="mt-6">
      <h3 class="text-lg font-medium mb-2">Preview Photos</h3>
      <PlacePhotoGallery 
        :place="{ name: placeName, photos: fetchedPhotos }"
        :max-photos="3"
      />
    </div>

    <!-- Save button -->
    <button @click="savePlace" class="btn btn-primary mt-4">
      Save Place
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useGooglePlaces } from '@/composables/useGooglePlaces'
import PlacePhotoGallery from '@/components/PlacePhotoGallery.vue'

export default {
  components: { PlacePhotoGallery },
  setup() {
    const { findPlaceId, loading: googlePlacesLoading } = useGooglePlaces()
    
    const placeName = ref('')
    const placeAddress = ref('')
    const fetchedPhotos = ref([])

    async function fetchPhotosForPlace() {
      if (!placeName.value || !placeAddress.value) return
      
      const { placeId, photos } = await findPlaceId(
        placeName.value, 
        placeAddress.value
      )
      
      if (photos.length > 0) {
        fetchedPhotos.value = photos
      }
    }

    async function savePlace() {
      // Save place with photos to Supabase
      const placeData = {
        name: placeName.value,
        address: placeAddress.value,
        photos: fetchedPhotos.value
        // ... other fields
      }
      
      // Your save logic here
    }

    return {
      placeName,
      placeAddress,
      fetchedPhotos,
      googlePlacesLoading,
      fetchPhotosForPlace,
      savePlace
    }
  }
}
</script>
```

## 🚀 Backfill Existing Places

After implementing the integration, run the backfill script to add photos to existing places:

```bash
# Make sure your .env.local has all required variables
node scripts/fetch-place-photos.js
```

The script will:
- Find all places without `google_place_id`
- Search Google Places API for each place
- Update database with place IDs and photos
- Show progress and success/failure stats
- Handle rate limiting automatically

## 🎨 Customization Options

### Custom Photo Sizes
```javascript
// In your component
const { getPhotoUrl } = useGooglePlaces()

// Get different sized photos
const thumbnailUrl = getPhotoUrl(photo.name, 200)
const mediumUrl = getPhotoUrl(photo.name, 800)
const largeUrl = getPhotoUrl(photo.name, 1200)
```

### Custom Gallery Props
```vue
<PlacePhotoGallery 
  :place="place"
  :max-photos="10"           <!-- Show up to 10 photos -->
  class="custom-gallery"     <!-- Add custom styling -->
/>
```

### Error Handling
```vue
<template>
  <PlacePhotoGallery 
    :place="place"
    @error="handleGalleryError"
  />
</template>

<script>
function handleGalleryError(error) {
  console.error('Photo gallery error:', error)
  // Handle error (show toast, etc.)
}
</script>
```

## 🔧 Troubleshooting

### Common Issues

1. **"No photos available" always shows**
   - Run the backfill script: `node scripts/fetch-place-photos.js`
   - Check if places have `google_place_id` and `photos` data in database

2. **API key errors**
   - Verify API key is correct in `.env.local`
   - Check Google Cloud Console that Places API (New) is enabled
   - Verify billing is enabled

3. **Rate limiting errors**
   - The scripts include automatic rate limiting
   - For high-volume usage, consider implementing request queuing

4. **Photos not loading**
   - Check browser console for CORS or network errors
   - Verify photo URLs are being generated correctly
   - Test with the verification script: `node scripts/test-google-api.js`

### Performance Tips

1. **Lazy loading**: Photos are lazy-loaded by default in the component
2. **Caching**: Photo URLs are deterministic and can be cached
3. **Responsive images**: Use different sizes for different screen sizes
4. **Batch processing**: The backfill script processes places in batches

## 🔒 Legal Compliance

### Required Attribution
- ✅ Google logo is displayed with every photo (handled automatically)
- ✅ Photographer credit is shown when available
- ✅ Photos are loaded via official API (no scraping)

### Terms of Service
- Photos are not downloaded or stored locally
- Attribution requirements are met automatically
- Usage complies with Google Places API ToS

## 📊 Monitoring

### Track API Usage
- Monitor your Google Cloud Console for API usage
- Set up billing alerts if needed
- Consider implementing usage analytics

### Database Performance
- Indexes are created for `google_place_id` and `photos` columns
- Monitor query performance on places table
- Consider pagination for large photo galleries

## 🔄 Maintenance

### Regular Tasks
- [ ] Monitor Google Cloud Console for API usage
- [ ] Update API key if needed (keys don't expire but can be rotated)
- [ ] Run backfill script for new places periodically
- [ ] Monitor photo loading performance

### Updates
- [ ] Keep Google Places API client libraries updated
- [ ] Monitor Google's API changelog for breaking changes
- [ ] Update photo display logic if Google changes photo response format

## 📚 Additional Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Google Places API Pricing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)
- [Vue 3 Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/installing)
<template>
  <div class="place-photo-gallery">
    <!-- Main Photo Display -->
    <div class="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
      <!-- Photo Display -->
      <div v-if="processedPhotos.length > 0" class="relative w-full h-full">
        <img
          :src="currentPhoto.url"
          :alt="`Photo of ${place.name}`"
          class="w-full h-full object-cover cursor-pointer transition-opacity duration-300"
          :class="{ 'opacity-50': imageLoading }"
          @click="openLightbox"
          @load="imageLoading = false"
          @error="handleImageError"
        />
        
        <!-- Loading overlay -->
        <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Navigation arrows for multiple photos -->
        <template v-if="processedPhotos.length > 1">
          <button
            @click="previousPhoto"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
            :disabled="currentIndex === 0"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button
            @click="nextPhoto"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
            :disabled="currentIndex === processedPhotos.length - 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentIndex === processedPhotos.length - 1 }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </template>

        <!-- Photo counter badge -->
        <div v-if="processedPhotos.length > 1" class="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
          {{ currentIndex + 1 }} / {{ processedPhotos.length }}
        </div>

        <!-- Google Attribution Overlay -->
        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center space-x-2">
              <img
                src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                alt="Google"
                class="h-4"
              />
              <span>Photos</span>
            </div>
            <div v-if="currentPhoto.attribution && currentPhoto.attribution !== 'Unknown'">
              by {{ currentPhoto.attribution }}
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback when no photos available -->
      <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
        <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
          </path>
        </svg>
        <p class="text-sm font-medium">No photos available</p>
        <p class="text-xs text-gray-400 mt-1">Photos will appear here when available</p>
      </div>
    </div>

    <!-- Thumbnail Strip -->
    <div v-if="processedPhotos.length > 1" class="mt-3">
      <div class="flex space-x-2 overflow-x-auto pb-2">
        <button
          v-for="(photo, index) in processedPhotos"
          :key="index"
          @click="currentIndex = index"
          class="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200"
          :class="[
            currentIndex === index 
              ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
              : 'border-gray-300 hover:border-gray-400'
          ]"
        >
          <img
            :src="getPhotoUrl(photo.originalPhoto.name, 200)"
            :alt="`Thumbnail ${index + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="mt-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
      {{ error }}
    </div>

    <!-- Lightbox Modal -->
    <div
      v-if="lightboxOpen"
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      @click="closeLightbox"
    >
      <div class="relative max-w-4xl max-h-full">
        <img
          :src="getPhotoUrl(currentPhoto.originalPhoto.name, 1200)"
          :alt="`Large view of ${place.name}`"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />
        
        <!-- Close button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Navigation in lightbox -->
        <template v-if="processedPhotos.length > 1">
          <button
            v-if="currentIndex > 0"
            @click.stop="previousPhoto"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button
            v-if="currentIndex < processedPhotos.length - 1"
            @click.stop="nextPhoto"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </template>

        <!-- Attribution in lightbox -->
        <div class="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <img
                src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                alt="Google"
                class="h-5"
              />
              <span class="text-sm">Photos</span>
            </div>
            <div v-if="currentPhoto.attribution && currentPhoto.attribution !== 'Unknown'" class="text-sm">
              Photo by {{ currentPhoto.attribution }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useGooglePlaces } from '../composables/useGooglePlaces'

export default {
  name: 'PlacePhotoGallery',
  props: {
    place: {
      type: Object,
      required: true,
      validator: (place) => {
        return place && typeof place === 'object' && place.name
      }
    },
    maxPhotos: {
      type: Number,
      default: 5,
      validator: (value) => value > 0 && value <= 20
    }
  },
  setup(props) {
    const { getPhotoUrl, getPhotoUrls } = useGooglePlaces()
    
    // Component state
    const currentIndex = ref(0)
    const lightboxOpen = ref(false)
    const imageLoading = ref(true)
    const error = ref(null)

    // Computed properties
    const processedPhotos = computed(() => {
      console.log('PlacePhotoGallery - Processing photos for:', props.place.name)
      console.log('PlacePhotoGallery - Raw photos data:', props.place.photos)
      
      if (!props.place.photos || !Array.isArray(props.place.photos)) {
        console.log('PlacePhotoGallery - No photos array found')
        return []
      }
      
      const photos = props.place.photos.slice(0, props.maxPhotos)
      console.log('PlacePhotoGallery - Sliced photos:', photos)
      
      const processed = getPhotoUrls(photos, 800)
      console.log('PlacePhotoGallery - Processed photos:', processed)
      
      return processed
    })

    const currentPhoto = computed(() => {
      return processedPhotos.value[currentIndex.value] || {}
    })

    // Watch for photo changes to reset loading state
    watch(() => currentIndex.value, () => {
      imageLoading.value = true
      error.value = null
    })

    watch(() => props.place, () => {
      currentIndex.value = 0
      imageLoading.value = true
      error.value = null
    }, { deep: true })

    // Methods
    function nextPhoto() {
      if (currentIndex.value < processedPhotos.value.length - 1) {
        currentIndex.value++
      }
    }

    function previousPhoto() {
      if (currentIndex.value > 0) {
        currentIndex.value--
      }
    }

    function openLightbox() {
      if (processedPhotos.value.length > 0) {
        lightboxOpen.value = true
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden'
      }
    }

    function closeLightbox() {
      lightboxOpen.value = false
      // Restore body scroll
      document.body.style.overflow = ''
    }

    function handleImageError() {
      imageLoading.value = false
      error.value = 'Failed to load image'
    }

    // Keyboard navigation for lightbox
    function handleKeydown(event) {
      if (!lightboxOpen.value) return
      
      switch (event.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          previousPhoto()
          break
        case 'ArrowRight':
          nextPhoto()
          break
      }
    }

    // Lifecycle
    document.addEventListener('keydown', handleKeydown)

    return {
      // State
      currentIndex,
      lightboxOpen,
      imageLoading,
      error,
      
      // Computed
      processedPhotos,
      currentPhoto,
      
      // Methods
      nextPhoto,
      previousPhoto,
      openLightbox,
      closeLightbox,
      handleImageError,
      getPhotoUrl
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for thumbnail strip */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Smooth transitions */
.place-photo-gallery img {
  transition: opacity 0.3s ease;
}

/* Responsive aspect ratio for older browsers */
.aspect-video {
  aspect-ratio: 16 / 9;
}

@supports not (aspect-ratio: 16 / 9) {
  .aspect-video {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
  }
  
  .aspect-video > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
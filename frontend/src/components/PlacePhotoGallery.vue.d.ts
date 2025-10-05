import { DefineComponent } from 'vue'

export interface PlacePhotoGalleryProps {
  place: {
    name: string
    photos?: Array<{
      name: string
      widthPx: number
      heightPx: number
      authorAttributions?: Array<{
        displayName: string
      }>
    }>
  }
  maxPhotos?: number
}

declare const PlacePhotoGallery: DefineComponent<PlacePhotoGalleryProps>
export default PlacePhotoGallery
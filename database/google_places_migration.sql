-- Google Places API Photo Integration Migration
-- Add google_place_id and photos columns to places table

ALTER TABLE places 
ADD COLUMN google_place_id VARCHAR(255),
ADD COLUMN photos JSONB DEFAULT '[]'::jsonb;

-- Create index on google_place_id for faster lookups
CREATE INDEX idx_places_google_place_id ON places(google_place_id);

-- Create index on photos column for JSONB operations
CREATE INDEX idx_places_photos ON places USING GIN(photos);

-- Add comment for documentation
COMMENT ON COLUMN places.google_place_id IS 'Google Places API place ID for fetching photos and additional data';
COMMENT ON COLUMN places.photos IS 'Array of photo objects from Google Places API with structure: [{"name": "places/.../photos/...", "widthPx": 4032, "heightPx": 3024, "authorAttributions": [{"displayName": "Author Name"}]}]';
-- Migration: Add Opening Hours to Places Table
-- Execute this in Supabase SQL Editor

-- Add opening hours columns to places table
ALTER TABLE places 
ADD COLUMN opening_hours JSONB DEFAULT NULL,
ADD COLUMN hours_last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for opening hours queries (optional for performance)
CREATE INDEX IF NOT EXISTS idx_places_opening_hours ON places USING GIN (opening_hours);
CREATE INDEX IF NOT EXISTS idx_places_hours_verified ON places(hours_last_verified_at);

-- Add comment to document the opening_hours structure
COMMENT ON COLUMN places.opening_hours IS 'Opening hours structure: {monday: {isOpen: boolean, openTime: string, closeTime: string}, ..., specialNotes: string}';
COMMENT ON COLUMN places.hours_last_verified_at IS 'Timestamp when opening hours were last verified or updated';

-- Example of the expected opening_hours structure:
-- {
--   "monday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
--   "tuesday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
--   "wednesday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
--   "thursday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
--   "friday": {"isOpen": true, "openTime": "09:00", "closeTime": "17:00"},
--   "saturday": {"isOpen": false, "openTime": null, "closeTime": null},
--   "sunday": {"isOpen": false, "openTime": null, "closeTime": null},
--   "specialNotes": "Kitchen closes at 18:00"
-- }

-- Update existing places with NULL opening hours (they will show as "Hours not verified")
-- No data update needed - NULL values are fine for MVP

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'places' 
AND column_name IN ('opening_hours', 'hours_last_verified_at');
-- Function to update a place with Google Places data including PostGIS location
-- This function allows setting the geography location column via Supabase RPC
--
-- Execute this in Supabase SQL Editor to create the function

CREATE OR REPLACE FUNCTION update_place_with_location(
  p_place_id UUID,
  p_google_place_id TEXT,
  p_photos JSONB,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_updated_at TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE places
  SET
    google_place_id = p_google_place_id,
    photos = p_photos,
    latitude = p_latitude,
    longitude = p_longitude,
    location = ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
    updated_at = p_updated_at
  WHERE id = p_place_id;
END;
$$;

-- Grant execute permission to the service role
GRANT EXECUTE ON FUNCTION update_place_with_location TO service_role;

-- Optional: Also grant to authenticated users if needed
-- GRANT EXECUTE ON FUNCTION update_place_with_location TO authenticated;

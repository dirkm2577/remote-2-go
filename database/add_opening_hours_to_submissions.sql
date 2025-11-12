-- Migration: Add opening_hours column to place_submissions table
-- This allows submitted places to include opening hours information
-- Run this in your Supabase SQL Editor

-- Add opening_hours column to place_submissions table
ALTER TABLE place_submissions
ADD COLUMN IF NOT EXISTS opening_hours JSONB;

-- Add comment explaining the column structure
COMMENT ON COLUMN place_submissions.opening_hours IS
'Opening hours in JSONB format with structure: { monday: {isOpen: boolean, openTime: string, closeTime: string}, ... }';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'place_submissions'
AND column_name = 'opening_hours';

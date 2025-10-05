-- Remote2Go Database Schema
-- Phase 1: Core places table with essential fields

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Places table - Core functionality
CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Berlin',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Work criteria (6 filter fields)
    wifi_quality VARCHAR(20) CHECK (wifi_quality IN ('excellent', 'good', 'fair')) NOT NULL,
    noise_level VARCHAR(20) CHECK (noise_level IN ('quiet', 'moderate', 'lively')) NOT NULL,
    power_outlets VARCHAR(20) CHECK (power_outlets IN ('many', 'some', 'limited')) NOT NULL,
    time_limit TEXT, -- Free form text like "2-3 hours", "All day", null for unlimited
    price_level VARCHAR(20) CHECK (price_level IN ('free', 'low', 'moderate', 'high')) NOT NULL,
    visit_type VARCHAR(20) CHECK (visit_type IN ('quick_stop', 'day_visit', 'multi_day')) NOT NULL,
    
    -- Additional information
    amenities TEXT[] DEFAULT '{}', -- Array of amenity strings
    description TEXT NOT NULL,
    
    -- Status and metadata
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_places_status ON places(status);
CREATE INDEX idx_places_visit_type ON places(visit_type);
CREATE INDEX idx_places_wifi_quality ON places(wifi_quality);
CREATE INDEX idx_places_noise_level ON places(noise_level);
CREATE INDEX idx_places_power_outlets ON places(power_outlets);
CREATE INDEX idx_places_price_level ON places(price_level);
CREATE INDEX idx_places_city ON places(city);
CREATE INDEX idx_places_location ON places(latitude, longitude);

-- Future tables for Phase 2+

-- Place submissions from users (Phase 2)
CREATE TABLE place_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Berlin',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Submitted work criteria
    wifi_quality VARCHAR(20) CHECK (wifi_quality IN ('excellent', 'good', 'fair')),
    noise_level VARCHAR(20) CHECK (noise_level IN ('quiet', 'moderate', 'lively')),
    power_outlets VARCHAR(20) CHECK (power_outlets IN ('many', 'some', 'limited')),
    time_limit TEXT,
    price_level VARCHAR(20) CHECK (price_level IN ('free', 'low', 'moderate', 'high')),
    visit_type VARCHAR(20) CHECK (visit_type IN ('quick_stop', 'day_visit', 'multi_day')),
    
    -- Submission details
    amenities TEXT[] DEFAULT '{}',
    description TEXT,
    submitter_email VARCHAR(255),
    
    -- Moderation
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter signups (Phase 2)
CREATE TABLE newsletter_signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON places
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_place_submissions_updated_at BEFORE UPDATE ON place_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (Enable when auth is added in Phase 2+)
-- ALTER TABLE places ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE place_submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;
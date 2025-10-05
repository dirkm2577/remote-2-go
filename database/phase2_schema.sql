-- Remote2Go Phase 2 Database Schema
-- Execute this in Supabase SQL Editor

-- Create places table (Phase 1 core table)
CREATE TABLE IF NOT EXISTS places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  wifi_quality TEXT CHECK (wifi_quality IN ('excellent', 'good', 'fair', 'poor')),
  noise_level TEXT CHECK (noise_level IN ('quiet', 'moderate', 'noisy')),
  time_limit INTEGER, -- in minutes, null = no limit
  power_outlets BOOLEAN DEFAULT false,
  price_level TEXT CHECK (price_level IN ('free', 'low', 'medium', 'high')),
  visit_type TEXT CHECK (visit_type IN ('quick_stop', 'day_visit', 'multi_day')),
  amenities TEXT[], -- array of amenity strings
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'archived')),
  verified BOOLEAN DEFAULT false,
  created_by UUID, -- References auth.users(id) but nullable for now
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 2 tables
CREATE TABLE IF NOT EXISTS place_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  wifi_quality TEXT,
  noise_level TEXT,
  time_limit INTEGER,
  power_outlets BOOLEAN,
  price_level TEXT,
  visit_type TEXT,
  amenities TEXT[],
  description TEXT,
  submitter_email TEXT,
  submitter_name TEXT,
  submission_source TEXT DEFAULT 'web_form',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  interested_cities TEXT[],
  signup_source TEXT,
  preferences JSONB DEFAULT '{}',
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_type TEXT CHECK (feedback_type IN ('suggestion', 'bug_report', 'general')),
  message TEXT NOT NULL,
  contact_email TEXT,
  related_place_id UUID REFERENCES places(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_places_city ON places(city);
CREATE INDEX IF NOT EXISTS idx_places_status_verified ON places(status, verified);
CREATE INDEX IF NOT EXISTS idx_places_visit_type ON places(visit_type);
CREATE INDEX IF NOT EXISTS idx_places_wifi_quality ON places(wifi_quality);
CREATE INDEX IF NOT EXISTS idx_places_price_level ON places(price_level);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON place_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON place_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_signups(email);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON user_feedback(status);

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Places are viewable by everyone" ON places
  FOR SELECT USING (status = 'active' AND verified = true);

CREATE POLICY "Anyone can submit places" ON place_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can sign up for newsletter" ON newsletter_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit feedback" ON user_feedback
  FOR INSERT WITH CHECK (true);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for places table
DROP TRIGGER IF EXISTS update_places_updated_at ON places;
CREATE TRIGGER update_places_updated_at
    BEFORE UPDATE ON places
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
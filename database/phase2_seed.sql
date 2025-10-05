-- Remote2Go Phase 2 Seed Data
-- Execute this after the schema to populate with test data

-- Insert test places data for Berlin
INSERT INTO places (name, address, city, latitude, longitude, wifi_quality, noise_level, time_limit, power_outlets, price_level, visit_type, amenities, description, verified) VALUES
-- Quick Stop places (1-3 hours)
('Café Central', 'Hackescher Markt 2, 10178 Berlin', 'Berlin', 52.5225, 13.4033, 'excellent', 'moderate', 180, true, 'medium', 'quick_stop', ARRAY['coffee', 'pastries', 'outdoor_seating'], 'Popular café near Hackescher Markt with reliable WiFi and plenty of seating.', true),

('Starbucks Potsdamer Platz', 'Potsdamer Platz 3, 10785 Berlin', 'Berlin', 52.5096, 13.3762, 'good', 'moderate', 120, true, 'medium', 'quick_stop', ARRAY['coffee', 'food', 'chain'], 'Busy Starbucks location perfect for quick work sessions with reliable WiFi.', true),

('McDonald''s Alexanderplatz', 'Alexanderplatz 5, 10178 Berlin', 'Berlin', 52.5219, 13.4132, 'fair', 'noisy', 90, false, 'low', 'quick_stop', ARRAY['fast_food', '24_hours', 'budget'], '24/7 fast food with basic WiFi, good for emergency work sessions.', true),

-- Day Visit places (4-8 hours)
('Staatsbibliothek Berlin', 'Unter den Linden 8, 10117 Berlin', 'Berlin', 52.5184, 13.3969, 'excellent', 'quiet', null, true, 'free', 'day_visit', ARRAY['library', 'study_rooms', 'free_access', 'quiet'], 'Historic state library with excellent study conditions and unlimited time.', true),

('St. Oberholz Mitte', 'Rosenthaler Str. 72A, 10119 Berlin', 'Berlin', 52.5289, 13.4015, 'excellent', 'moderate', 240, true, 'medium', 'day_visit', ARRAY['coffee', 'laptop_friendly', 'coworking_vibe'], 'Famous laptop café in Mitte, very welcoming to remote workers.', true),

('Café Einstein Stammhaus', 'Kurfürstenstr. 58, 10785 Berlin', 'Berlin', 52.5025, 13.3644, 'good', 'quiet', 300, true, 'medium', 'day_visit', ARRAY['coffee', 'traditional', 'newspapers', 'quiet'], 'Traditional Viennese café with quiet atmosphere perfect for focused work.', true),

('Humboldt University Library', 'Unter den Linden 6, 10099 Berlin', 'Berlin', 52.5177, 13.3944, 'good', 'quiet', null, true, 'free', 'day_visit', ARRAY['library', 'university', 'study_rooms', 'academic'], 'University library open to public with quiet study areas and academic atmosphere.', true),

-- Multi-Day Stay places (coworking spaces)
('Rocket Internet Campus', 'Johannisstraße 20, 10117 Berlin', 'Berlin', 52.5236, 13.3894, 'excellent', 'moderate', null, true, 'high', 'multi_day', ARRAY['coworking', 'meeting_rooms', 'startup_environment', 'networking'], 'Premium coworking space in the heart of startup Berlin with all amenities.', true),

('WeWork Potsdamer Platz', 'Kemperplatz 1, 10785 Berlin', 'Berlin', 52.5081, 13.3759, 'excellent', 'moderate', null, true, 'high', 'multi_day', ARRAY['coworking', 'meeting_rooms', 'events', 'community', 'premium'], 'Modern coworking space with premium amenities and professional networking.', true),

('GTEC - Google Tech Entrepreneurs Club', 'Torstr. 109, 10119 Berlin', 'Berlin', 52.5289, 13.4007, 'excellent', 'quiet', null, true, 'medium', 'multi_day', ARRAY['coworking', 'tech_focus', 'startup', 'quiet_zones'], 'Tech-focused coworking space with excellent infrastructure and community.', true),

('Factory Berlin Mitte', 'Rheinsberger Str. 76/77, 10115 Berlin', 'Berlin', 52.5319, 13.3847, 'excellent', 'moderate', null, true, 'high', 'multi_day', ARRAY['coworking', 'creative', 'events', 'community', 'networking'], 'Creative coworking space with vibrant community and regular events.', true),

-- Additional variety places
('The Barn Roastery', 'Schönhauser Allee 8, 10119 Berlin', 'Berlin', 52.5289, 13.4092, 'excellent', 'quiet', 150, false, 'medium', 'quick_stop', ARRAY['specialty_coffee', 'quiet', 'minimal_seating'], 'Specialty coffee roastery with excellent WiFi but limited seating.', true),

('Zur Letzten Instanz', 'Waisenstr. 14-16, 10179 Berlin', 'Berlin', 52.5150, 13.4186, 'good', 'moderate', 180, true, 'medium', 'day_visit', ARRAY['restaurant', 'historic', 'traditional', 'german_food'], 'Historic restaurant with WiFi, good for relaxed work sessions over traditional German food.', true),

('Silo Coffee', 'Gabriel-Max-Str. 4, 10245 Berlin', 'Berlin', 52.5069, 13.4519, 'good', 'moderate', 240, true, 'medium', 'day_visit', ARRAY['specialty_coffee', 'industrial_design', 'friedrichshain'], 'Industrial-style café in Friedrichshain with good WiFi and relaxed atmosphere.', true),

('Klunkerkranich', 'Karl-Marx-Str. 66, 12043 Berlin', 'Berlin', 52.4816, 13.4311, 'fair', 'moderate', 300, false, 'medium', 'day_visit', ARRAY['rooftop', 'views', 'unique', 'seasonal'], 'Unique rooftop bar/café with amazing views, seasonal opening hours.', true);

-- Insert some sample submissions for testing admin interface
INSERT INTO place_submissions (name, address, city, latitude, longitude, wifi_quality, noise_level, time_limit, power_outlets, price_level, visit_type, amenities, description, submitter_email, submitter_name, submission_source) VALUES
('Café Kranzler', 'Kurfürstendamm 18-19, 10719 Berlin', 'Berlin', 52.5030, 13.3356, 'good', 'moderate', 180, true, 'medium', 'quick_stop', ARRAY['coffee', 'historic', 'kurfuerstendamm'], 'Historic café on Kurfürstendamm with good WiFi and traditional atmosphere.', 'user@example.com', 'Test User', 'web_form'),

('Berlin Public Library Friedrichshain', 'Frankfurter Allee 14A, 10247 Berlin', 'Berlin', 52.5147, 13.4633, 'excellent', 'quiet', null, true, 'free', 'day_visit', ARRAY['library', 'free', 'study_rooms'], 'Local library branch with excellent study facilities and free WiFi.', 'contributor@example.com', 'Library Fan', 'web_form');

-- Verify the data
-- SELECT COUNT(*) as total_places FROM places;
-- SELECT visit_type, COUNT(*) as count FROM places GROUP BY visit_type;
-- SELECT wifi_quality, COUNT(*) as count FROM places GROUP BY wifi_quality;
-- Remote2Go Seed Data
-- Insert test places data for development and testing

INSERT INTO places (
    name, address, city, latitude, longitude,
    wifi_quality, noise_level, power_outlets, time_limit, price_level, visit_type,
    amenities, description
) VALUES 
-- Quick Stop places (1-3 hours)
(
    'Starbucks Potsdamer Platz',
    'Potsdamer Platz 3, 10785 Berlin',
    'Berlin',
    52.5096, 13.3762,
    'good', 'lively', 'some', '2-3 hours', 'moderate', 'quick_stop',
    ARRAY['wifi', 'coffee', 'food', 'restroom'],
    'Busy coffee shop perfect for short work sessions with reliable WiFi and central location.'
),
(
    'McDonald''s Alexanderplatz',
    'Alexanderplatz 5, 10178 Berlin',
    'Berlin',
    52.5219, 13.4132,
    'fair', 'lively', 'limited', '1-2 hours', 'low', 'quick_stop',
    ARRAY['wifi', 'food', '24_hours', 'restroom'],
    '24/7 fast food with basic WiFi, good for quick work sessions and late-night availability.'
),
(
    'Coffee Fellows Hauptbahnhof',
    'Hauptbahnhof, Europaplatz 1, 10557 Berlin',
    'Berlin',
    52.5255, 13.3692,
    'good', 'moderate', 'some', '1-3 hours', 'moderate', 'quick_stop',
    ARRAY['wifi', 'coffee', 'food', 'transportation'],
    'Convenient coffee shop in the main train station, perfect for travelers and quick meetings.'
),

-- Day Visit places (4-8 hours)
(
    'Café Central',
    'Hackescher Markt 2, 10178 Berlin',
    'Berlin',
    52.5225, 13.4017,
    'excellent', 'moderate', 'many', '4-6 hours', 'moderate', 'day_visit',
    ARRAY['wifi', 'power_outlets', 'coffee', 'food', 'outdoor_seating'],
    'Spacious café in the heart of Berlin with excellent WiFi, plenty of seating, and great atmosphere.'
),
(
    'Café Einstein Stammhaus',
    'Kurfürstenstr. 58, 10785 Berlin',
    'Berlin',
    52.5025, 13.3644,
    'good', 'quiet', 'some', '4-5 hours', 'moderate', 'day_visit',
    ARRAY['wifi', 'coffee', 'food', 'quiet_space', 'newspapers'],
    'Traditional Viennese café with quiet atmosphere perfect for focused work and reading.'
),
(
    'Kreuzberg Library',
    'Adalbertstr. 2, 10999 Berlin',
    'Berlin',
    52.5006, 13.4175,
    'good', 'quiet', 'some', 'All day', 'free', 'day_visit',
    ARRAY['wifi', 'quiet_space', 'books', 'study_rooms'],
    'Local library with quiet work environment, free WiFi, and dedicated study areas.'
),
(
    'Rocket Internet Hub',
    'Unter den Linden 26-30, 10117 Berlin',
    'Berlin',
    52.5175, 13.3906,
    'excellent', 'moderate', 'many', '8 hours', 'high', 'day_visit',
    ARRAY['wifi', 'power_outlets', 'meeting_rooms', 'coffee', 'printing', 'phone_booths'],
    'Premium coworking space with professional atmosphere, high-speed internet, and all business amenities.'
),

-- Multi-Day Stay places (2+ days, good for extended work)
(
    'Berlin Central Library',
    'Breite Str. 36, 10178 Berlin',
    'Berlin',
    52.5170, 13.4099,
    'excellent', 'quiet', 'many', 'All day', 'free', 'multi_day',
    ARRAY['wifi', 'power_outlets', 'quiet_space', 'study_rooms', 'books', 'printing'],
    'Main public library with dedicated work areas, excellent facilities, and quiet environment for extended work sessions.'
),
(
    'WeWork Potsdamer Platz',
    'Kemperplatz 1, 10785 Berlin',
    'Berlin',
    52.5081, 13.3759,
    'excellent', 'moderate', 'many', 'All day', 'high', 'multi_day',
    ARRAY['wifi', 'power_outlets', 'meeting_rooms', 'coffee', 'phone_booths', 'printing', 'events', 'community'],
    'Modern coworking space with premium amenities, professional networking opportunities, and flexible workspace options.'
),
(
    'GTEC Coworking',
    'Torstr. 109, 10119 Berlin',
    'Berlin',
    52.5289, 13.4007,
    'excellent', 'quiet', 'many', 'All day', 'moderate', 'multi_day',
    ARRAY['wifi', 'power_outlets', 'meeting_rooms', 'quiet_space', 'printing', 'kitchen'],
    'Tech-focused coworking space with excellent infrastructure, quiet zones, and community of developers and entrepreneurs.'
),

-- Additional variety places
(
    'St. Oberholz Rosenthaler Platz',
    'Rosenthaler Str. 72A, 10119 Berlin',
    'Berlin',
    52.5289, 13.4015,
    'good', 'moderate', 'some', '3-4 hours', 'moderate', 'day_visit',
    ARRAY['wifi', 'coffee', 'food', 'laptops_welcome'],
    'Laptop-friendly café popular with freelancers and digital nomads, known for welcoming remote workers.'
),
(
    'The Barn Mitte',
    'Auguststr. 58, 10119 Berlin',
    'Berlin',
    52.5289, 13.3892,
    'excellent', 'quiet', 'limited', '2-3 hours', 'moderate', 'quick_stop',
    ARRAY['wifi', 'specialty_coffee', 'quiet_space'],
    'Specialty coffee shop with excellent WiFi and quiet atmosphere, perfect for focused short sessions.'
),
(
    'Factory Berlin Görlitzer Park',
    'Lohmühlenstr. 65, 12435 Berlin',
    'Berlin',
    52.4947, 13.4406,
    'excellent', 'moderate', 'many', 'All day', 'high', 'multi_day',
    ARRAY['wifi', 'power_outlets', 'meeting_rooms', 'events', 'community', 'phone_booths', 'printing'],
    'Creative coworking space with startup atmosphere, excellent facilities, and regular networking events.'
),

-- More budget-friendly options
(
    'Humboldt University Library',
    'Unter den Linden 6, 10099 Berlin',
    'Berlin',
    52.5177, 13.3944,
    'good', 'quiet', 'some', 'All day', 'free', 'multi_day',
    ARRAY['wifi', 'quiet_space', 'study_rooms', 'books', 'academic_resources'],
    'University library open to public with quiet study areas, reliable WiFi, and academic atmosphere.'
),
(
    'Silo Coffee',
    'Gabriel-Max-Str. 4, 10245 Berlin',
    'Berlin',
    52.5069, 13.4519,
    'good', 'moderate', 'some', '3-4 hours', 'moderate', 'day_visit',
    ARRAY['wifi', 'specialty_coffee', 'food', 'outdoor_seating'],
    'Industrial-style café in Friedrichshain with good WiFi, specialty coffee, and relaxed atmosphere.'
),
(
    'Father Carpenter Coffee Brewers',
    'Münzstr. 21, 10178 Berlin',
    'Berlin',
    52.5225, 13.4086,
    'excellent', 'quiet', 'limited', '2-3 hours', 'moderate', 'quick_stop',
    ARRAY['wifi', 'specialty_coffee', 'quiet_space'],
    'Small specialty coffee shop with excellent WiFi and quiet environment, perfect for focused work.'
);

-- Verify the data
-- SELECT COUNT(*) FROM places;
-- SELECT visit_type, COUNT(*) FROM places GROUP BY visit_type;
-- SELECT wifi_quality, COUNT(*) FROM places GROUP BY wifi_quality;
-- SELECT price_level, COUNT(*) FROM places GROUP BY price_level;
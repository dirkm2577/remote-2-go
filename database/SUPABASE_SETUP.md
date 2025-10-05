# Supabase Database Setup for Remote2Go Phase 2

## Prerequisites
- Supabase account created
- Project created with the credentials provided in the Phase 2 prompt
- Access to Supabase SQL Editor

## Setup Instructions

### Step 1: Execute Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the contents of `phase2_schema.sql`
5. Click **Run** to execute the schema

### Step 2: Seed Database
1. In the same SQL Editor
2. Create another new query
3. Copy and paste the contents of `phase2_seed.sql`
4. Click **Run** to populate with test data

### Step 3: Verify Setup
Run this query to verify everything is working:

```sql
-- Check if all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('places', 'place_submissions', 'newsletter_signups', 'user_feedback');

-- Check places data
SELECT COUNT(*) as total_places FROM places;
SELECT visit_type, COUNT(*) as count FROM places GROUP BY visit_type;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public';
```

## Important Notes

### Row Level Security (RLS)
- All tables have RLS enabled for security
- Public read access is granted for active, verified places
- Insert policies allow anyone to submit places, newsletter signups, and feedback
- Admin operations will need to be performed with service role key

### Data Structure Changes from Phase 1
- `power_outlets` is now boolean (true/false) instead of string
- `noise_level` values are: 'quiet', 'moderate', 'noisy' (not 'lively')
- `price_level` values are: 'free', 'low', 'medium', 'high' (not 'moderate')
- `time_limit` is now integer (minutes) instead of string
- Added `verified` boolean field - only verified places are shown publicly

### Testing the Connection
After setup, the backend should automatically switch from mock data to real Supabase data. You can test this by:

1. Making API calls to `http://localhost:3001/api/places`
2. Checking the console logs - should see "Supabase configured" instead of "Using mock data"
3. Verifying that filtering works with the new data structure

## Troubleshooting

### If RLS blocks queries:
```sql
-- Temporarily disable RLS for testing (re-enable after)
ALTER TABLE places DISABLE ROW LEVEL SECURITY;
-- Remember to re-enable: ALTER TABLE places ENABLE ROW LEVEL SECURITY;
```

### If you get permission errors:
- Make sure you're using the correct service role key in backend/.env
- Check that the policies are created correctly
- Verify the Supabase URL and keys are correct

### If no data appears:
- Check that places have `verified = true` and `status = 'active'`
- Verify the seed data was inserted correctly
- Check browser network tab for API errors
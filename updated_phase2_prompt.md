# Claude Code Prompt: Remote2Go MVP - Phase 2 Community Features

## Project Overview
Build upon the Phase 1 foundation by adding community-driven features that enable user contributions and growth tracking. This phase transforms Remote2Go from a static directory into a community-powered platform.

## Phase 2 Goals
Extend the existing app with:
- User place submission system
- Email newsletter signup for growth
- Basic feedback collection
- Content moderation workflow
- Enhanced user engagement features

**Deliverable**: A community-enabled web app where users can submit new places, sign up for updates, and provide feedback while maintaining content quality through moderation.

## Phase 2 Prerequisites: Database Setup

### Supabase Integration (Missing from Phase 1)
Before implementing Phase 2 features, complete the database connection that was deferred from Phase 1:

#### Install Supabase Client
```bash
npm install @supabase/supabase-js
```

#### Configure Environment Variables
Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=https://qoydwcbtdetrbjkmficm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFveWR3Y2J0ZGV0cmJqa21maWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjA1MDEsImV4cCI6MjA3NDI5NjUwMX0.6adiOBvcFi6Bo3KoUtABu-OxHz9jP2VMic-jx7Vu3pY
```

#### Create Supabase Client
Create `src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### Database Schema Setup
Execute this SQL in Supabase SQL Editor to create the complete schema:
```sql
-- Create places table (Phase 1 core table)
CREATE TABLE places (
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 2 tables
CREATE TABLE place_submissions (
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

CREATE TABLE newsletter_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  interested_cities TEXT[],
  signup_source TEXT,
  preferences JSONB DEFAULT '{}',
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_type TEXT CHECK (feedback_type IN ('suggestion', 'bug_report', 'general')),
  message TEXT NOT NULL,
  contact_email TEXT,
  related_place_id UUID REFERENCES places(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Places are viewable by everyone" ON places
  FOR SELECT USING (status = 'active' AND verified = true);

CREATE POLICY "Anyone can submit places" ON place_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can sign up for newsletter" ON newsletter_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit feedback" ON user_feedback
  FOR INSERT WITH CHECK (true);
```

#### Seed Database with Test Data
Execute this SQL to populate with Berlin test places:
```sql
INSERT INTO places (name, address, city, latitude, longitude, wifi_quality, noise_level, time_limit, power_outlets, price_level, visit_type, amenities, description, verified) VALUES
('Café Central', 'Hackescher Markt 2, 10178 Berlin', 'Berlin', 52.5225, 13.4033, 'excellent', 'moderate', 180, true, 'medium', 'quick_stop', '["coffee", "pastries", "outdoor_seating"]', 'Popular café near Hackescher Markt with reliable WiFi and plenty of seating.', true),
('Staatsbibl iothek Berlin', 'Unter den Linden 8, 10117 Berlin', 'Berlin', 52.5184, 13.3969, 'excellent', 'quiet', null, true, 'free', 'day_visit', '["library", "study_rooms", "free_access"]', 'Historic state library with excellent study conditions and unlimited time.', true),
('Rocket Internet Campus', 'Johannisstraße 20, 10117 Berlin', 'Berlin', 52.5236, 13.3894, 'excellent', 'moderate', 480, true, 'high', 'multi_day', '["coworking", "meeting_rooms", "startup_environment"]', 'Premium coworking space in the heart of startup Berlin.', true);
-- Add more test places as needed
```

#### Update Existing Components
Modify existing Phase 1 components to use Supabase instead of mock data:

**Example: Places List Component**
```javascript
import { supabase } from '@/lib/supabase'

export default {
  data() {
    return {
      places: [],
      loading: false,
      filters: {
        visit_type: '',
        wifi_quality: '',
        // ... other filters
      }
    }
  },
  async mounted() {
    await this.fetchPlaces()
  },
  methods: {
    async fetchPlaces() {
      this.loading = true
      let query = supabase
        .from('places')
        .select('*')
        .eq('city', 'Berlin')
        .eq('verified', true)
        .eq('status', 'active')
      
      // Apply filters
      if (this.filters.visit_type) {
        query = query.eq('visit_type', this.filters.visit_type)
      }
      if (this.filters.wifi_quality) {
        query = query.eq('wifi_quality', this.filters.wifi_quality)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching places:', error)
      } else {
        this.places = data
      }
      
      this.loading = false
    }
  }
}
```

## New Features to Implement

### 1. Place Submission System
- **Multi-step form**: Guided process for adding new places
- **Form validation**: Ensure data quality and completeness  
- **Submission queue**: Store submissions for admin review
- **User feedback**: Clear success/pending status communication

### 2. Email Newsletter Integration
- **Strategic placement**: Homepage hero, after place interactions
- **City interest tracking**: Let users specify cities they're interested in
- **Growth metrics**: Track signup sources and engagement
- **GDPR compliance**: Clear opt-in with privacy policy

### 3. Feedback & Engagement
- **Feedback collection**: Simple way for users to report issues or suggestions
- **Social sharing**: Allow users to share favorite places
- **Usage analytics**: Track popular places and user behavior patterns

### 4. Admin Moderation Interface
- **Submission review**: Simple interface to approve/reject submissions
- **Content editing**: Ability to modify submissions before approval
- **Bulk actions**: Efficiently process multiple submissions
- **Integration**: Seamlessly add approved places to main database

## Technical Requirements

### Database Extensions
```sql
-- Extend existing schema with new tables
place_submissions:
  - id, submitted_data (jsonb), submitter_email, submitter_name
  - status (pending/approved/rejected), admin_notes
  - submission_source, created_at

newsletter_signups:
  - id, email, interested_cities[], signup_source
  - preferences (jsonb), confirmed_at, created_at

user_feedback:
  - id, feedback_type, message, contact_email
  - related_place_id (optional), status, created_at
```

### Form Implementation
- **Place submission form**: All 6 filter criteria + basic info + description
- **Smart address validation**: Help users enter accurate location data
- **Photo upload**: Optional images for place submissions
- **Progress indicators**: Multi-step form with clear progression

### Email Service Integration
- **Service choice**: Mailchimp, ConvertKit, or Supabase email auth
- **Double opt-in**: Confirm email addresses for quality
- **Segmentation**: Group by interested cities and signup source
- **Basic templates**: Welcome email and city launch notifications

## User Experience Enhancements

### Community Engagement Flow
1. **Submit a Place**: Prominent CTA on places list and detail pages
2. **Newsletter Signup**: "Get notified when we add [your city]"  
3. **Feedback Loop**: Easy way to suggest improvements or report issues
4. **Social Proof**: Show community contribution stats

### Mobile-Optimized Forms
- **Touch-friendly**: Large buttons and inputs for mobile users
- **Smart keyboard**: Appropriate input types (email, number, text)
- **Minimal steps**: Reduce friction while maintaining data quality
- **Save progress**: Don't lose data if user navigates away

## Admin Features

### Moderation Dashboard
- **Clean interface**: Review submissions with place preview
- **Comparison view**: See similar existing places to avoid duplicates
- **Quick actions**: Approve/reject with keyboard shortcuts
- **Edit capability**: Modify submission data before approval
- **Batch processing**: Handle multiple submissions efficiently

### Content Management
- **Place status**: Active/pending/rejected/archived
- **Bulk editing**: Update multiple places at once
- **Duplicate detection**: Flag potentially duplicate submissions
- **Quality control**: Maintain high standards for approved places

## Integration Requirements

### Existing Code Integration
- **Preserve Phase 1**: All existing functionality must remain working
- **Extend components**: Add new features to existing place cards and lists
- **State management**: Expand Pinia stores for new features
- **API endpoints**: Add new routes while maintaining existing ones

### User Interface Updates
- **Navigation**: Add links to "Submit Place" and "Feedback"
- **CTAs**: Strategic placement of community action buttons
- **Status indicators**: Show submission status and community stats
- **Loading states**: Handle form submissions and async operations

## Implementation Priorities

### High Priority (Core Phase 2)
1. Complete database integration (if not done in Phase 1)
2. Place submission form with validation
3. Admin moderation interface
4. Newsletter signup integration
5. Basic feedback collection

### Medium Priority (Phase 2 Polish)
1. Email confirmation flow
2. Submission status tracking
3. Social sharing buttons
4. Enhanced admin dashboard

### Nice-to-Have (If Time Permits)
1. Photo upload for submissions
2. User submission history
3. Advanced duplicate detection
4. Community statistics display

## Success Criteria for Phase 2
- ✅ Database fully integrated and working with existing UI
- ✅ Users can submit new places through intuitive form
- ✅ Admin can review and approve/reject submissions
- ✅ Approved submissions appear in main places list
- ✅ Newsletter signup works and stores emails
- ✅ Feedback system captures user input
- ✅ All Phase 1 functionality remains intact
- ✅ Forms work well on mobile devices
- ✅ Email confirmations send properly

## Quality Guidelines

### Data Validation
- **Required fields**: Enforce essential information for place quality
- **Address verification**: Help users enter accurate locations
- **Duplicate prevention**: Check for similar existing places
- **Spam protection**: Basic rate limiting and validation

### User Experience
- **Clear messaging**: Users understand submission process and timeline
- **Helpful errors**: Descriptive validation messages
- **Success feedback**: Confirm actions and set expectations
- **Mobile optimization**: Smooth experience on all devices

## Security & Privacy

### Form Security
- **Input sanitization**: Prevent XSS and injection attacks
- **Rate limiting**: Prevent spam submissions
- **CSRF protection**: Secure form submissions
- **Data validation**: Server-side validation for all inputs

### Privacy Compliance
- **GDPR ready**: Clear consent for email collection
- **Data retention**: Define how long to store submissions
- **User rights**: Ability to delete submitted data
- **Privacy policy**: Update to cover new data collection

## Next Phase Preview
**Phase 3** will focus on:
- Advanced admin tools and analytics
- SEO optimization and content marketing
- Performance optimization for scale
- Launch preparation and monitoring

Build upon the solid Phase 1 foundation while maintaining code quality and user experience. Focus on creating genuine value for the community while establishing the growth mechanisms needed for a successful launch.
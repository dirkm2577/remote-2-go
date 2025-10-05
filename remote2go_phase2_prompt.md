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
1. Place submission form with validation
2. Admin moderation interface
3. Newsletter signup integration
4. Basic feedback collection

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
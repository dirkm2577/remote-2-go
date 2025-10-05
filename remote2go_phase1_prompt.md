# Claude Code Prompt: Remote2Go MVP - Phase 1 Foundation

## Project Overview
Create the foundation for Remote2Go, a web application that helps remote workers find work-friendly places in their city. This Phase 1 focuses on core architecture, basic UI, and data structure with test data.

## Phase 1 Goals
Build a solid foundation with:
- Complete project structure and development environment
- Basic UI with landing page and places list
- Database schema and test data
- Core filtering functionality (6 criteria)
- Google Maps navigation integration

**Deliverable**: A working web app where users can view test places, apply filters, and open Google Maps directions.

## Core Requirements

### Business Logic
- **6 Filter Criteria**: WiFi Quality, Power Outlets, Noise Level, Time Limits, Price Level, Visit Type
- **Visit Types**: Quick Stop (1-3 hours), Day Visit (4-8 hours), Multi-Day Stay (2+ days)
- **Navigation**: Google Maps deep links for instant directions
- **Mobile-First**: Responsive design optimized for mobile usage

### Technical Stack
- **Frontend**: Vue 3 + TypeScript + Vite + TailwindCSS + Pinia
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (frontend) + Supabase (backend services)

### Database Schema Requirements
```sql
-- Essential fields for places table
places:
  - Basic info: id, name, address, city, latitude, longitude
  - Work criteria: wifi_quality, noise_level, power_outlets, time_limit, price_level, visit_type
  - Additional: amenities[], description, status, timestamps
  
-- Support tables as needed:
  - place_submissions (for future community features)
  - newsletter_signups (for growth tracking)
```

### Core User Journey
1. **Landing Page**: Clear value proposition + "Find Places" CTA
2. **Places List**: Filter sidebar + places grid/list with key info
3. **Place Details**: Full info + prominent "Open in Maps" button
4. **Navigation**: Google Maps deep link opens directions

### UI/UX Requirements
- Clean, modern design with TailwindCSS
- Visit type badges and filter indicators
- Responsive layout (mobile-first approach)
- Loading states and error handling
- Intuitive filter combinations

## Technical Specifications

### Google Maps Integration
```typescript
// Simple deep link implementation required
const openInMaps = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
  window.open(url, '_blank');
};
```

### Filter System Logic
- Primary filter: Visit Type (Quick Stop, Day Visit, Multi-Day)
- Secondary filters: WiFi, Power, Noise, Time, Price
- Smart defaults: Suggest relevant filters based on visit type
- Real-time filtering without page reloads

### Test Data Requirements
- Create 15-20 realistic test places across all visit types
- Include variety: cafés, libraries, coworking spaces
- Use realistic Berlin addresses with proper coordinates
- Ensure good coverage of all filter combinations

## Project Structure Requirements
```
remote2go-mvp/
├── frontend/          # Vue 3 + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript  
├── database/          # Supabase schema + seed files
├── .env.example       # Environment variables template
└── README.md          # Setup and development instructions
```

## Success Criteria for Phase 1
- ✅ App runs locally with `npm run dev`
- ✅ Database connected with test data
- ✅ All 6 filters working and combinable
- ✅ Places display with key information
- ✅ "Open in Maps" buttons work on mobile and desktop
- ✅ Responsive design looks good on phone and computer
- ✅ Code is well-organized and ready for Phase 2 features

## Phase 1 Scope Limitations
**Include**: Core filtering, place display, maps navigation, responsive design
**Exclude**: User accounts, place submissions, admin interface, analytics, email capture

## Next Phases Preview
- **Phase 2**: Community features (add places, newsletter signup)
- **Phase 3**: Admin moderation and content management
- **Phase 4**: Analytics, SEO optimization, and launch preparation

Focus on building a solid, testable foundation that demonstrates the core value proposition. Keep the code clean and extensible for easy iteration in subsequent phases.
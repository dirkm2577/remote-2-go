# Remote2Go MVP - Phase 1

A web application to help remote workers find work-friendly places in Berlin with reliable WiFi, power outlets, and the perfect atmosphere for productivity.

## 🚀 Features Implemented (Phase 1)

- **Landing Page**: Clear value proposition and call-to-action
- **Places List**: Browse work-friendly locations with detailed information
- **Smart Filtering**: Filter by visit type, WiFi quality, noise level, power outlets, and price
- **Google Maps Integration**: Instant directions with one-click navigation
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Real-time API**: Backend API with filtering and mock data

## 🛠 Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite + TailwindCSS + Pinia
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL) - *Configuration pending*
- **Deployment**: Vercel (frontend) + Supabase (backend services)

## 📁 Project Structure

```
remote2go-mvp/
├── frontend/          # Vue 3 + TypeScript + Vite
│   ├── src/
│   │   ├── views/     # Home and Places pages
│   │   ├── stores/    # Pinia state management
│   │   ├── types/     # TypeScript interfaces
│   │   └── components/
├── backend/           # Node.js + Express + TypeScript  
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # Business logic
│   │   ├── types/     # TypeScript interfaces
│   │   └── config/    # Database configuration
├── database/          # Supabase schema + seed files
├── .env.example       # Environment variables template
└── README.md          # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd remote2go-mvp
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (optional for Phase 1)
   ```

3. **Start the backend server**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend will be available at: http://localhost:3001

4. **Start the frontend development server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will be available at: http://localhost:5173

5. **Open your browser**
   - Visit http://localhost:5173 to see the application
   - API endpoints available at http://localhost:3001/api/places

## 🔌 API Endpoints

- `GET /` - API information and health
- `GET /health` - Health check endpoint
- `GET /api/places` - Get all places
- `GET /api/places?visitType=quick_stop` - Filter places by visit type
- `GET /api/places?wifiQuality=excellent&noiseLevel=quiet` - Multiple filters
- `GET /api/places/:id` - Get single place by ID

### Available Filter Parameters

- `visitType`: `quick_stop`, `day_visit`, `multi_day`
- `wifiQuality`: `excellent`, `good`, `fair`
- `noiseLevel`: `quiet`, `moderate`, `noisy`
- `powerOutlets`: `many`, `some`, `limited`
- `priceLevel`: `free`, `low`, `medium`, `high`

## 📱 Usage

1. **Landing Page**: Start at the home page to see the value proposition
2. **Browse Places**: Click "Find Places Now" to view available locations
3. **Filter Results**: Use the sidebar to filter places by your preferences
4. **Get Directions**: Click "Open in Maps" for instant Google Maps navigation

## 🗂 Mock Data

Phase 1 includes 8+ realistic test places in Berlin:

- Café Central (Day Visit)
- Berlin Central Library (Multi-Day, Free)
- Rocket Internet Hub (Day Visit, Premium)
- Starbucks Potsdamer Platz (Quick Stop)
- WeWork Potsdamer Platz (Multi-Day, Premium)
- Traditional cafés and libraries with various amenities

## ✅ Phase 1 Success Criteria

- [x] App runs locally with `npm run dev`
- [x] All 6 filters working and combinable
- [x] Places display with key information
- [x] "Open in Maps" buttons work on mobile and desktop
- [x] Responsive design looks good on phone and computer
- [x] Code is well-organized and ready for Phase 2 features
- [x] Backend API with filtering functionality
- [x] Frontend connected to backend with real-time filtering

## 🔮 Next Steps (Phase 2)

- Set up Supabase database with real data
- Implement user accounts and authentication
- Add place submission functionality
- Newsletter signup feature
- Admin interface for content management

## 🧪 Testing

Test the application by:

1. **Backend API**: `curl http://localhost:3001/api/places`
2. **Filtered API**: `curl "http://localhost:3001/api/places?visitType=quick_stop"`
3. **Frontend**: Navigate to http://localhost:5173 and test all filters
4. **Google Maps**: Click "Open in Maps" on any place card

## 🤝 Development

- **Frontend Port**: 5173
- **Backend Port**: 3001
- **Hot Reload**: Both frontend and backend support hot reload for development
- **CORS**: Configured to allow frontend-backend communication

## 📋 Environment Variables

Create a `.env` file in the backend directory:

```env
# Optional for Phase 1 (uses mock data)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Backend Configuration
PORT=3001
NODE_ENV=development
```

The application works without Supabase configuration in Phase 1, using mock data for development and testing.
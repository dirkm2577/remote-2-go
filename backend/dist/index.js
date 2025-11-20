"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const places_1 = __importDefault(require("./routes/places"));
const placeSubmissions_1 = __importDefault(require("./routes/placeSubmissions"));
const newsletter_1 = __importDefault(require("./routes/newsletter"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const admin_1 = __importDefault(require("./routes/admin"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.vercel.app']
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Remote2Go API is running!',
        version: '1.0.0',
        endpoints: {
            places: '/api/places',
            newsletter: '/api/newsletter',
            feedback: '/api/feedback',
            admin: '/api/admin',
            health: '/health'
        }
    });
});
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});
app.use('/api/places', places_1.default);
app.use('/api/place-submissions', placeSubmissions_1.default);
app.use('/api/newsletter', newsletter_1.default);
app.use('/api/feedback', feedback_1.default);
app.use('/api/admin', admin_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🗺️  Places API: http://localhost:${PORT}/api/places`);
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Admin authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (token !== adminPassword) {
        return res.status(403).json({ error: 'Invalid admin credentials' });
    }
    req.isAdmin = true;
    next();
};
exports.adminAuth = adminAuth;
//# sourceMappingURL=adminAuth.js.map
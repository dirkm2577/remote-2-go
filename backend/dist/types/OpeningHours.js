"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCurrentlyOpen = exports.createEmptyOpeningHours = exports.DAY_LABELS = exports.DAYS_OF_WEEK = void 0;
// Utility functions
exports.DAYS_OF_WEEK = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];
exports.DAY_LABELS = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
};
// Create empty opening hours structure
const createEmptyOpeningHours = () => ({
    monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    saturday: { isOpen: false, openTime: null, closeTime: null },
    sunday: { isOpen: false, openTime: null, closeTime: null },
    specialNotes: null
});
exports.createEmptyOpeningHours = createEmptyOpeningHours;
// Check if a place is currently open
const isCurrentlyOpen = (openingHours) => {
    if (!openingHours)
        return false;
    const now = new Date();
    const currentDay = exports.DAYS_OF_WEEK[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Convert Sunday=0 to Sunday=6
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
    const dayHours = openingHours[currentDay];
    if (!dayHours.isOpen || !dayHours.openTime || !dayHours.closeTime) {
        return false;
    }
    const [openHour, openMin] = dayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = dayHours.closeTime.split(':').map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    // Handle overnight hours (e.g., 22:00 - 02:00)
    if (closeMinutes < openMinutes) {
        return currentTime >= openMinutes || currentTime <= closeMinutes;
    }
    return currentTime >= openMinutes && currentTime <= closeMinutes;
};
exports.isCurrentlyOpen = isCurrentlyOpen;
//# sourceMappingURL=OpeningHours.js.map
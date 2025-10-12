export interface DayHours {
  isOpen: boolean
  openTime: string | null  // Format: "HH:MM" (24-hour format)
  closeTime: string | null // Format: "HH:MM" (24-hour format)
}

export interface OpeningHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
  specialNotes?: string | null
}

export interface PlaceOpeningHours {
  openingHours: OpeningHours | null
  lastVerifiedAt: string | null // ISO date string
}

// Helper type for form handling
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

// Utility functions
export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

export const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday', 
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
} as const

// Create empty opening hours structure
export const createEmptyOpeningHours = (): OpeningHours => ({
  monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
  saturday: { isOpen: false, openTime: null, closeTime: null },
  sunday: { isOpen: false, openTime: null, closeTime: null },
  specialNotes: null
})

// Check if a place is currently open
export const isCurrentlyOpen = (openingHours: OpeningHours | null): boolean => {
  if (!openingHours) return false
  
  const now = new Date()
  const currentDay = DAYS_OF_WEEK[now.getDay() === 0 ? 6 : now.getDay() - 1] // Convert Sunday=0 to Sunday=6
  const currentTime = now.getHours() * 60 + now.getMinutes() // minutes since midnight
  
  const dayHours = openingHours[currentDay]
  
  if (!dayHours.isOpen || !dayHours.openTime || !dayHours.closeTime) {
    return false
  }
  
  const [openHour, openMin] = dayHours.openTime.split(':').map(Number)
  const [closeHour, closeMin] = dayHours.closeTime.split(':').map(Number)
  
  const openMinutes = openHour * 60 + openMin
  const closeMinutes = closeHour * 60 + closeMin
  
  // Handle overnight hours (e.g., 22:00 - 02:00)
  if (closeMinutes < openMinutes) {
    return currentTime >= openMinutes || currentTime <= closeMinutes
  }
  
  return currentTime >= openMinutes && currentTime <= closeMinutes
}

// Get next opening time
export const getNextOpeningInfo = (openingHours: OpeningHours | null): { day: string, time: string } | null => {
  if (!openingHours) return null
  
  const now = new Date()
  const currentDayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1
  
  // Check each day starting from today
  for (let i = 0; i < 7; i++) {
    const dayIndex = (currentDayIndex + i) % 7
    const day = DAYS_OF_WEEK[dayIndex]
    const dayHours = openingHours[day]
    
    if (dayHours.isOpen && dayHours.openTime) {
      // If it's today, check if opening time hasn't passed
      if (i === 0) {
        const [openHour, openMin] = dayHours.openTime.split(':').map(Number)
        const openMinutes = openHour * 60 + openMin
        const currentMinutes = now.getHours() * 60 + now.getMinutes()
        
        if (currentMinutes < openMinutes) {
          return { day: 'Today', time: dayHours.openTime }
        }
      } else {
        const dayLabel = i === 1 ? 'Tomorrow' : DAY_LABELS[day]
        return { day: dayLabel, time: dayHours.openTime }
      }
    }
  }
  
  return null
}
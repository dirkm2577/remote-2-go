<template>
  <div class="space-y-4">
    <!-- Status Badge and Current Day -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Opening Hours</h3>
      <div v-if="openingHours">
        <span
          :class="statusBadgeClass"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        >
          {{ isOpen ? 'Open now' : 'Closed' }}
        </span>
      </div>
    </div>

    <!-- No Hours Available -->
    <div v-if="!openingHours" class="text-center py-6 bg-gray-50 rounded-lg">
      <div class="text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h4 class="mt-2 text-sm font-medium text-gray-900">Hours not verified</h4>
        <p class="mt-1 text-sm text-gray-500">
          Opening hours for this place haven't been confirmed yet.
        </p>
      </div>
    </div>

    <!-- Hours Display -->
    <div v-else class="space-y-3">
      <!-- Today's Hours (Prominent) -->
      <div v-if="todayHours" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-sm font-medium text-indigo-900">Today</span>
            <span class="ml-2 text-sm text-indigo-700">{{ currentDayLabel }}</span>
          </div>
          <div class="text-sm font-medium text-indigo-900">
            <span v-if="todayHours.isOpen && todayHours.openTime && todayHours.closeTime">
              <span v-if="is24Hours(todayHours.openTime, todayHours.closeTime)">Open 24 hours</span>
              <span v-else>{{ formatTime(todayHours.openTime) }} - {{ formatTime(todayHours.closeTime) }}</span>
            </span>
            <span v-else class="text-indigo-600">Closed</span>
          </div>
        </div>
        
        <!-- Next Opening Info -->
        <div v-if="!isOpen && nextOpening" class="mt-2 text-xs text-indigo-600">
          Opens {{ nextOpening.day }} at {{ formatTime(nextOpening.time) }}
        </div>
      </div>

      <!-- Toggle for Full Week -->
      <button
        type="button"
        @click="showFullWeek = !showFullWeek"
        class="flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <span>{{ showFullWeek ? 'Hide' : 'Show' }} full week</span>
        <svg
          :class="{ 'rotate-180': showFullWeek }"
          class="ml-1 h-4 w-4 transform transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Full Week Schedule -->
      <div v-if="showFullWeek" class="space-y-2">
        <div
          v-for="day in DAYS_OF_WEEK"
          :key="day"
          class="flex items-center justify-between py-2 px-3 rounded"
          :class="{ 'bg-indigo-50': isToday(day) }"
        >
          <span
            class="text-sm"
            :class="{ 'font-medium text-indigo-900': isToday(day), 'text-gray-700': !isToday(day) }"
          >
            {{ DAY_LABELS[day] }}
          </span>
          <span
            class="text-sm"
            :class="{ 'font-medium text-indigo-900': isToday(day), 'text-gray-600': !isToday(day) }"
          >
            <span v-if="openingHours[day].isOpen && openingHours[day].openTime && openingHours[day].closeTime">
              <span v-if="is24Hours(openingHours[day].openTime!, openingHours[day].closeTime!)">Open 24 hours</span>
              <span v-else>{{ formatTime(openingHours[day].openTime!) }} - {{ formatTime(openingHours[day].closeTime!) }}</span>
            </span>
            <span v-else class="text-gray-500">Closed</span>
          </span>
        </div>
      </div>

      <!-- Special Notes -->
      <div v-if="openingHours.specialNotes" class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-start">
          <svg class="flex-shrink-0 h-4 w-4 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div class="ml-2">
            <p class="text-sm text-amber-800">{{ openingHours.specialNotes }}</p>
          </div>
        </div>
      </div>

      <!-- Last Verified -->
      <div v-if="lastVerified" class="text-xs text-gray-500">
        Hours last verified {{ formatLastVerified(lastVerified) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { OpeningHours, DayOfWeek } from '../types/OpeningHours'
import { 
  DAYS_OF_WEEK, 
  DAY_LABELS, 
  isCurrentlyOpen, 
  getNextOpeningInfo 
} from '../types/OpeningHours'

interface Props {
  openingHours: OpeningHours | null
  lastVerified?: string | null
}

const props = defineProps<Props>()

const showFullWeek = ref(false)

// Current status
const isOpen = computed(() => isCurrentlyOpen(props.openingHours))

const statusBadgeClass = computed(() => {
  return isOpen.value
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
})

// Current day info
const currentDay = computed((): DayOfWeek => {
  const now = new Date()
  const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1
  return DAYS_OF_WEEK[dayIndex] ?? 'monday' // Convert Sunday=0 to Sunday=6
})

const currentDayLabel = computed(() => DAY_LABELS[currentDay.value])

const todayHours = computed(() => {
  return props.openingHours ? props.openingHours[currentDay.value] : null
})

// Next opening info
const nextOpening = computed(() => {
  return getNextOpeningInfo(props.openingHours)
})

// Helper functions
const isToday = (day: DayOfWeek): boolean => {
  return day === currentDay.value
}

const is24Hours = (openTime: string, closeTime: string): boolean => {
  return openTime === '00:00' && closeTime === '00:00'
}

const formatTime = (time: string): string => {
  try {
    const parts = time.split(':')
    const hours = parts[0] || '0'
    const minutes = parts[1] || '00'
    const hour = parseInt(hours, 10)
    const min = minutes

    if (hour === 0) return `12:${min} AM`
    if (hour < 12) return `${hour}:${min} AM`
    if (hour === 12) return `12:${min} PM`
    return `${hour - 12}:${min} PM`
  } catch {
    return time // Return original if parsing fails
  }
}

const formatLastVerified = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'today'
    if (diffInDays === 1) return 'yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return date.toLocaleDateString()
  } catch {
    return dateString
  }
}
</script>
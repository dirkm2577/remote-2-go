<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-4">Opening Hours</h3>
      <p class="text-sm text-gray-600 mb-6">
        Set the opening hours for this place. You can mark individual days as closed.
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        type="button"
        @click="copyToAllDays"
        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Copy Monday to All Days
      </button>
      <button
        type="button"
        @click="closeWeekends"
        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Close Weekends
      </button>
    </div>

    <!-- Day-by-Day Hours -->
    <div class="space-y-4">
      <div
        v-for="day in DAYS_OF_WEEK"
        :key="day"
        class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
        :class="{ 'bg-gray-50': !localHours[day].isOpen }"
      >
        <!-- Day Label -->
        <div class="flex-shrink-0 w-24">
          <label class="text-sm font-medium text-gray-900">
            {{ DAY_LABELS[day] }}
          </label>
        </div>

        <!-- Open/Closed Toggle -->
        <div class="flex items-center">
          <input
            :id="`${day}-open`"
            v-model="localHours[day].isOpen"
            type="checkbox"
            @change="handleDayToggle(day)"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            :for="`${day}-open`"
            class="ml-2 block text-sm text-gray-900"
          >
            Open
          </label>
        </div>

        <!-- Time Inputs -->
        <div v-if="localHours[day].isOpen" class="flex items-center space-x-2 flex-1">
          <div>
            <label :for="`${day}-open-time`" class="sr-only">Opening time</label>
            <input
              :id="`${day}-open-time`"
              v-model="localHours[day].openTime"
              type="time"
              @change="validateTimes(day)"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <span class="text-gray-500">to</span>
          <div>
            <label :for="`${day}-close-time`" class="sr-only">Closing time</label>
            <input
              :id="`${day}-close-time`"
              v-model="localHours[day].closeTime"
              type="time"
              @change="validateTimes(day)"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Closed indicator -->
        <div v-else class="flex-1 text-sm text-gray-500 italic">
          Closed
        </div>

        <!-- Validation Error -->
        <div v-if="errors[day]" class="text-sm text-red-600">
          {{ errors[day] }}
        </div>
      </div>
    </div>

    <!-- Special Notes -->
    <div>
      <label for="special-notes" class="block text-sm font-medium text-gray-700 mb-2">
        Special Notes
      </label>
      <textarea
        id="special-notes"
        v-model="localHours.specialNotes"
        rows="3"
        placeholder="e.g., Kitchen closes at 18:00, Limited service on Sundays"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <p class="mt-1 text-xs text-gray-500">
        Optional notes about exceptions or special conditions
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { OpeningHours, DayOfWeek } from '../types/OpeningHours'
import { DAYS_OF_WEEK, DAY_LABELS, createEmptyOpeningHours } from '../types/OpeningHours'

interface Props {
  modelValue: OpeningHours | null
}

interface Emits {
  (e: 'update:modelValue', value: OpeningHours | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state
const localHours = ref<OpeningHours>(
  props.modelValue || createEmptyOpeningHours()
)

const errors = reactive<Record<string, string>>({})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    localHours.value = { ...newValue }
  } else {
    localHours.value = createEmptyOpeningHours()
  }
}, { deep: true })

// Watch for local changes and emit
watch(localHours, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Validation
const validateTimes = (day: DayOfWeek) => {
  const dayHours = localHours.value[day]
  
  if (!dayHours.isOpen) {
    errors[day] = ''
    return
  }

  if (!dayHours.openTime || !dayHours.closeTime) {
    errors[day] = 'Both open and close times are required'
    return
  }

  const openParts = dayHours.openTime.split(':').map(Number)
  const closeParts = dayHours.closeTime.split(':').map(Number)
  const openHour = openParts[0] ?? 0
  const openMin = openParts[1] ?? 0
  const closeHour = closeParts[0] ?? 0
  const closeMin = closeParts[1] ?? 0

  const openMinutes = openHour * 60 + openMin
  const closeMinutes = closeHour * 60 + closeMin
  
  // Allow overnight hours (close time before open time)
  // Only show error if they are exactly the same
  if (openMinutes === closeMinutes) {
    errors[day] = 'Open and close times cannot be the same'
  } else {
    errors[day] = ''
  }
}

// Quick actions
const copyToAllDays = () => {
  const mondayHours = localHours.value.monday
  DAYS_OF_WEEK.forEach(day => {
    if (day !== 'monday') {
      localHours.value[day] = { ...mondayHours }
    }
  })
}

const closeWeekends = () => {
  localHours.value.saturday = { isOpen: false, openTime: null, closeTime: null }
  localHours.value.sunday = { isOpen: false, openTime: null, closeTime: null }
}

const handleDayToggle = (day: DayOfWeek) => {
  if (!localHours.value[day].isOpen) {
    // When closing, clear the times
    localHours.value[day].openTime = null
    localHours.value[day].closeTime = null
    errors[day] = ''
  } else {
    // When opening, set default times if not already set
    if (!localHours.value[day].openTime) {
      localHours.value[day].openTime = '09:00'
    }
    if (!localHours.value[day].closeTime) {
      localHours.value[day].closeTime = '17:00'
    }
  }
}
</script>
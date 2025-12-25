// Default 17 routines with metadata
export const DEFAULT_ROUTINES = [
    // Morning (Category: morning)
    { id: 1, name: 'Wake up', category: 'morning', scheduledTime: '07:00', isEnabled: true, order: 1 },
    { id: 2, name: 'Meditation', category: 'morning', scheduledTime: '07:15', isEnabled: true, order: 2 },
    { id: 3, name: 'Coffee', category: 'morning', scheduledTime: '07:30', isEnabled: true, order: 3 },
    { id: 4, name: 'Breakfast', category: 'morning', scheduledTime: '08:00', isEnabled: true, order: 4 },

    // Work (Category: work)
    { id: 5, name: 'Start Work', category: 'work', scheduledTime: '09:00', isEnabled: true, order: 5 },
    { id: 6, name: 'Mid-morning Break', category: 'work', scheduledTime: '10:30', isEnabled: true, order: 6 },
    { id: 7, name: 'Lunch', category: 'work', scheduledTime: '12:30', isEnabled: true, order: 7 },
    { id: 8, name: 'Afternoon Break', category: 'work', scheduledTime: '15:00', isEnabled: true, order: 8 },
    { id: 9, name: 'End Work', category: 'work', scheduledTime: '18:00', isEnabled: true, order: 9 },

    // Exercise (Category: exercise)
    { id: 10, name: 'Gym/Workout', category: 'exercise', scheduledTime: '18:30', isEnabled: true, order: 10 },
    { id: 11, name: 'Evening Walk', category: 'exercise', scheduledTime: '19:30', isEnabled: true, order: 11 },
    { id: 12, name: 'Vitamins', category: 'exercise', scheduledTime: '20:00', isEnabled: true, order: 12 },

    // Household (Category: household)
    { id: 13, name: 'Cook Dinner', category: 'household', scheduledTime: '19:00', isEnabled: true, order: 13 },
    { id: 14, name: 'Dishes', category: 'household', scheduledTime: '20:00', isEnabled: true, order: 14 },
    { id: 15, name: 'Laundry', category: 'household', scheduledTime: null, isEnabled: true, order: 15 },
    { id: 16, name: 'Clean Room', category: 'household', scheduledTime: null, isEnabled: true, order: 16 },

    // Evening (Category: evening)
    { id: 17, name: 'Reading', category: 'evening', scheduledTime: '21:30', isEnabled: true, order: 17 },
    { id: 18, name: 'Bedtime', category: 'evening', scheduledTime: '22:30', isEnabled: true, order: 18 },
];

// Category definitions
export const CATEGORIES = {
    morning: { name: 'Morning', color: '#87CEEB', icon: 'weather-sunny' },
    work: { name: 'Work', color: '#5B7C99', icon: 'briefcase' },
    exercise: { name: 'Exercise', color: '#52B788', icon: 'run' },
    household: { name: 'Household', color: '#E8956B', icon: 'home' },
    evening: { name: 'Evening', color: '#9B59B6', icon: 'weather-night' },
};

// Notification channels
export const NOTIFICATION_CHANNELS = {
    ROUTINE_REMINDERS: 'routine-reminders',
    DAILY_SUMMARY: 'daily-summary',
};

// Time constants
export const TIME_OF_DAY = {
    MORNING: { start: 5, end: 12, greeting: 'Good morning' },
    AFTERNOON: { start: 12, end: 17, greeting: 'Good afternoon' },
    EVENING: { start: 17, end: 21, greeting: 'Good evening' },
    NIGHT: { start: 21, end: 5, greeting: 'Good night' },
};

// Database version
export const DB_VERSION = 1;
export const DB_NAME = 'lifetracker.db';

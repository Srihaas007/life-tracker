import { isWithinInterval, addMinutes, subMinutes, isPast, isFuture, isToday, parseISO } from 'date-fns';
import { formatDateForDB } from './dateHelpers';

/**
 * Check if current time is within the allowed window for a routine
 * @param {string} scheduledTime - Time in HH:mm format (e.g., "08:00")
 * @param {Date} date - The date to check (defaults to today)
 * @param {number} windowMinutes - Minutes before/after scheduled time (default 30)
 * @returns {object} { canCheck: boolean, reason: string, minutesUntilStart: number, minutesUntilEnd: number }
 */
export const isWithinTimeWindow = (scheduledTime, date = new Date(), windowMinutes = 30) => {
    if (!scheduledTime) {
        // No scheduled time means it can be done anytime today
        return { canCheck: true, reason: 'anytime' };
    }

    const now = new Date();
    const dateStr = formatDateForDB(date);
    const todayStr = formatDateForDB(now);

    // Can only check today's tasks
    if (dateStr !== todayStr) {
        if (isPast(parseISO(dateStr))) {
            return { canCheck: false, reason: 'past_date', message: 'Cannot check past dates' };
        }
        if (isFuture(parseISO(dateStr))) {
            return { canCheck: false, reason: 'future_date', message: 'Cannot check future dates' };
        }
    }

    // Parse scheduled time (HH:mm)
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const scheduledDateTime = new Date(now);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    // Calculate window
    const windowStart = subMinutes(scheduledDateTime, windowMinutes);
    const windowEnd = addMinutes(scheduledDateTime, windowMinutes);

    // Check if current time is within window
    const withinWindow = isWithinInterval(now, { start: windowStart, end: windowEnd });

    if (withinWindow) {
        const minutesUntilEnd = Math.round((windowEnd.getTime() - now.getTime()) / 60000);
        return {
            canCheck: true,
            reason: 'within_window',
            minutesRemaining: minutesUntilEnd,
            message: `${minutesUntilEnd} min remaining`
        };
    }

    // Check if before window
    if (now < windowStart) {
        const minutesUntilStart = Math.round((windowStart.getTime() - now.getTime()) / 60000);
        return {
            canCheck: false,
            reason: 'too_early',
            minutesUntilStart,
            message: `Available in ${minutesUntilStart} min`
        };
    }

    // Must be after window
    return {
        canCheck: false,
        reason: 'too_late',
        message: 'Window expired'
    };
};

/**
 * Check if a routine's time window has completely expired
 */
export const hasWindowExpired = (scheduledTime, date = new Date(), windowMinutes = 30) => {
    if (!scheduledTime) return false;

    const checkResult = isWithinTimeWindow(scheduledTime, date, windowMinutes);
    return checkResult.reason === 'too_late';
};

/**
 * Get color indicator for time window status
 */
export const getTimeWindowColor = (scheduledTime, date = new Date()) => {
    const result = isWithinTimeWindow(scheduledTime, date);

    if (result.canCheck) {
        if (result.minutesRemaining <= 10) {
            return '#FF9800'; // Orange - time running out
        }
        return '#4CAF50'; // Green - plenty of time
    }

    if (result.reason === 'too_late') {
        return '#F44336'; // Red - expired
    }

    return '#9E9E9E'; // Gray - not yet available
};

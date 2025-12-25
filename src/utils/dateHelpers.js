import { format, isToday, isYesterday, parseISO, startOfDay, endOfDay, isWeekend } from 'date-fns';

/**
 * Format date to YYYY-MM-DD for database storage
 */
export const formatDateForDB = (date) => {
    return format(date, 'yyyy-MM-dd');
};

/**
 * Get display name for date (Today, Yesterday, or formatted date)
 */
export const getDateDisplayName = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(dateObj)) return 'Today';
    if (isYesterday(dateObj)) return 'Yesterday';

    return format(dateObj, 'EEEE, MMM d');
};

/**
 * Get greeting based on current time
 */
export const getGreeting = (date = new Date()) => {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    const isWeekendDay = dayOfWeek === 0 || dayOfWeek === 6;

    let text, icon;

    if (isWeekendDay) {
        const dayName = format(date, 'EEEE');
        text = `Happy ${dayName}`;
        icon = 'party-popper';
    } else if (hour >= 5 && hour < 12) {
        text = 'Good morning';
        icon = 'weather-sunny';
    } else if (hour >= 12 && hour < 17) {
        text = 'Good afternoon';
        icon = 'white-balance-sunny';
    } else if (hour >= 17 && hour < 21) {
        text = 'Good evening';
        icon = 'weather-sunset';
    } else {
        text = 'Good night';
        icon = 'weather-night';
    }

    return { text, icon };
};

/**
 * Check if date is a weekend
 */
export const isWeekendDay = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isWeekend(dateObj);
};

/**
 * Format date for display in header
 */
export const formatDateForDisplay = (dateString) => {
    if (!dateString) return format(new Date(), 'EEEE, MMMM d, yyyy');
    const dateObj = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(dateObj, 'EEEE, MMMM d, yyyy');
};

/**
 * Get today's date as a string (YYYY-MM-DD)
 */
export const getTodayDateString = () => {
    return formatDateForDB(new Date());
};

/**
 * Format time for display (12-hour format)
 */
export const formatTimeForDisplay = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Get date range for last N days
 */
export const getLastNDays = (n = 7) => {
    const dates = [];
    const today = new Date();

    for (let i = n - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(formatDateForDB(date));
    }

    return dates;
};

/**
 * Get start and end of day for filtering
 */
export const getDayBounds = (date) => {
    return {
        start: startOfDay(date),
        end: endOfDay(date),
    };
};

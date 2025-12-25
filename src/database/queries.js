import { getDatabase } from './schema';
import { formatDateForDB } from '../utils/dateHelpers';

/**
 * Routine Items Queries
 */
export const getAllRoutines = async () => {
    const db = await getDatabase();
    return await db.getAllAsync('SELECT * FROM routine_items ORDER BY order_index ASC');
};

export const getEnabledRoutines = async () => {
    const db = await getDatabase();
    return await db.getAllAsync('SELECT * FROM routine_items WHERE is_enabled = 1 ORDER BY order_index ASC');
};

export const getRoutinesByCategory = async (category) => {
    const db = await getDatabase();
    return await db.getAllAsync(
        'SELECT * FROM routine_items WHERE category = ? ORDER BY order_index ASC',
        [category]
    );
};

export const updateRoutine = async (id, updates) => {
    const db = await getDatabase();
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await db.runAsync(
        `UPDATE routine_items SET ${setClause} WHERE id = ?`,
        [...values, id]
    );
};

export const addRoutine = async (routine) => {
    const db = await getDatabase();
    const result = await db.runAsync(
        `INSERT INTO routine_items (name, category, scheduled_time, is_enabled, order_index) 
     VALUES (?, ?, ?, ?, ?)`,
        [routine.name, routine.category, routine.scheduledTime || null, routine.isEnabled ? 1 : 0, routine.order || 99]
    );
    return result.lastInsertRowId;
};

export const deleteRoutine = async (id) => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM routine_items WHERE id = ?', [id]);
};

/**
 * Routine Completions Queries
 */
export const getCompletionsForDate = async (date) => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    return await db.getAllAsync(
        `SELECT rc.*, ri.name, ri.category 
     FROM routine_completions rc 
     JOIN routine_items ri ON rc.routine_id = ri.id 
     WHERE rc.date = ?`,
        [dateStr]
    );
};

export const toggleRoutineCompletion = async (routineId, date) => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    // Check if already completed
    const existing = await db.getFirstAsync(
        'SELECT * FROM routine_completions WHERE routine_id = ? AND date = ?',
        [routineId, dateStr]
    );

    if (existing) {
        // Remove completion
        await db.runAsync(
            'DELETE FROM routine_completions WHERE routine_id = ? AND date = ?',
            [routineId, dateStr]
        );
        return false;
    } else {
        // Add completion
        await db.runAsync(
            'INSERT INTO routine_completions (routine_id, date) VALUES (?, ?)',
            [routineId, dateStr]
        );
        return true;
    }
};

export const isRoutineCompleted = async (routineId, date) => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    const result = await db.getFirstAsync(
        'SELECT COUNT(*) as count FROM routine_completions WHERE routine_id = ? AND date = ?',
        [routineId, dateStr]
    );

    return result.count > 0;
};

/**
 * Daily Entries Queries
 */
export const getDailyEntry = async (date) => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    return await db.getFirstAsync('SELECT * FROM daily_entries WHERE date = ?', [dateStr]);
};

export const createOrUpdateDailyEntry = async (date, data) => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    const existing = await getDailyEntry(dateStr);

    if (existing) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map(field => `${field} = ?`).join(', ');

        await db.runAsync(
            `UPDATE daily_entries SET ${setClause} WHERE date = ?`,
            [...values, dateStr]
        );
    } else {
        const fields = ['date', ...Object.keys(data)];
        const placeholders = fields.map(() => '?').join(', ');
        const values = [dateStr, ...Object.values(data)];

        await db.runAsync(
            `INSERT INTO daily_entries (${fields.join(', ')}) VALUES (${placeholders})`,
            values
        );
    }
};

export const toggleExercise = async (date) => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    const entry = await getDailyEntry(dateStr);
    const newValue = entry ? (entry.exercise_done ? 0 : 1) : 1;

    await createOrUpdateDailyEntry(dateStr, { exercise_done: newValue });
    return newValue === 1;
};

/**
 * Weight Logs Queries
 */
export const getWeightLog = async (date) => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    return await db.getFirstAsync('SELECT * FROM weight_logs WHERE date = ?', [dateStr]);
};

export const addWeightLog = async (date, weight, unit = 'kg') => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    await db.runAsync(
        'INSERT OR REPLACE INTO weight_logs (date, weight, unit) VALUES (?, ?, ?)',
        [dateStr, weight, unit]
    );
};

/**
 * Statistics Queries
 */
export const getCompletionStatsForDateRange = async (startDate, endDate) => {
    const db = await getDatabase();

    return await db.getAllAsync(
        `SELECT date, COUNT(*) as completed_count 
     FROM routine_completions 
     WHERE date BETWEEN ? AND ? 
     GROUP BY date 
     ORDER BY date ASC`,
        [startDate, endDate]
    );
};

export const getCompletionPercentageForDate = async (date) => {
    const db = await getDatabase();
    const dateStr = typeof date === 'string' ? date : formatDateForDB(date);

    // Get total enabled routines
    const totalResult = await db.getFirstAsync(
        'SELECT COUNT(*) as total FROM routine_items WHERE is_enabled = 1'
    );

    // Get completed routines for date
    const completedResult = await db.getFirstAsync(
        'SELECT COUNT(*) as completed FROM routine_completions rc JOIN routine_items ri ON rc.routine_id = ri.id WHERE rc.date = ? AND ri.is_enabled = 1',
        [dateStr]
    );

    const total = totalResult.total || 0;
    const completed = completedResult.completed || 0;

    return total > 0 ? Math.round((completed / total) * 100) : 0;
};

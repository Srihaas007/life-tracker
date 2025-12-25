import { getDatabase } from './schema';

/**
 * User Settings queries
 */

export const getUserSetting = async (key) => {
    try {
        const db = await getDatabase();
        const result = await db.getFirstAsync(
            'SELECT value FROM user_settings WHERE key = ?',
            [key]
        );
        return result ? result.value : null;
    } catch (error) {
        // Table might not exist yet during initial setup - this is expected
        if (error.message && error.message.includes('no such table')) {
            return null;
        }
        console.error('Error getting user setting:', error);
        return null;
    }
};

export const setUserSetting = async (key, value) => {
    try {
        const db = await getDatabase();
        await db.runAsync(
            `INSERT OR REPLACE INTO user_settings (key, value, updated_at) 
       VALUES (?, ?, datetime('now'))`,
            [key, value]
        );
        return true;
    } catch (error) {
        console.error('Error setting user setting:', error);
        return false;
    }
};

export const getUserName = async () => {
    return await getUserSetting('user_name');
};

export const setUserName = async (name) => {
    return await setUserSetting('user_name', name);
};

export const getHasCompletedOnboarding = async () => {
    const result = await getUserSetting('has_completed_onboarding');
    return result === 'true';
};

export const setHasCompletedOnboarding = async () => {
    return await setUserSetting('has_completed_onboarding', 'true');
};

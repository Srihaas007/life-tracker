import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { getAllRoutines, getCompletionsForDate, addRoutine, updateRoutine } from '../database/queries';
import { getUserName, setUserName } from '../database/userSettings';
import { getLastNDays } from '../utils/dateHelpers';
import { getDatabase } from '../database/schema';

/**
 * Export all app data to JSON format
 */
export const exportData = async () => {
    try {
        // Gather all data
        const userName = await getUserName();
        const routines = await getAllRoutines();

        // Get completions for last 90 days
        const dates = getLastNDays(90);
        const completionsMap = {};

        for (const date of dates) {
            const completions = await getCompletionsForDate(date);
            if (completions.length > 0) {
                completionsMap[date] = completions;
            }
        }

        // Calculate statistics
        const totalRoutines = routines.length;
        const enabledRoutines = routines.filter(r => r.is_enabled === 1).length;
        const totalCompletedDays = Object.keys(completionsMap).length;

        // Create export object
        const exportObj = {
            exportVersion: '1.0',
            exportDate: new Date().toISOString(),
            appVersion: '1.0.0',
            user: {
                name: userName || '',
            },
            routines: routines.map(r => ({
                id: r.id,
                name: r.name,
                category: r.category,
                scheduled_time: r.scheduled_time,
                is_enabled: r.is_enabled,
                order_index: r.order_index,
            })),
            completions: completionsMap,
            statistics: {
                totalRoutines,
                enabledRoutines,
                totalCompletedDays,
                dateRange: dates.length > 0 ? {
                    from: dates[0],
                    to: dates[dates.length - 1],
                } : null,
            },
        };

        // Convert to JSON string (formatted for readability)
        const jsonString = JSON.stringify(exportObj, null, 2);

        // Save to file
        const fileName = `life-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, jsonString);

        return {
            success: true,
            fileUri,
            fileName,
            data: exportObj,
        };
    } catch (error) {
        console.error('Error exporting data:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Share exported data file
 */
export const shareData = async () => {
    try {
        const exportResult = await exportData();

        if (!exportResult.success) {
            throw new Error(exportResult.error);
        }

        // Check if sharing is available
        const isSharingAvailable = await Sharing.isAvailableAsync();

        if (!isSharingAvailable) {
            return {
                success: false,
                error: 'Sharing is not available on this device',
                fileUri: exportResult.fileUri,
            };
        }

        // Share the file
        await Sharing.shareAsync(exportResult.fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Share Life Tracker Backup',
            UTI: 'public.json',
        });

        return {
            success: true,
            fileName: exportResult.fileName,
        };
    } catch (error) {
        console.error('Error sharing data:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Pick and import data file
 */
export const pickAndImportData = async () => {
    try {
        // Open document picker
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return {
                success: false,
                error: 'Import cancelled',
            };
        }

        // Read file content
        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);

        // Import the data
        return await importData(fileContent);
    } catch (error) {
        console.error('Error picking file:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Import data from JSON string
 */
export const importData = async (jsonString) => {
    try {
        const importedData = JSON.parse(jsonString);

        // Validate data structure
        if (!importedData.exportVersion || !importedData.routines) {
            throw new Error('Invalid backup file format');
        }

        const db = await getDatabase();

        // Import user name if present
        if (importedData.user && importedData.user.name) {
            await setUserName(importedData.user.name);
        }

        // Import routines
        let routinesImported = 0;
        for (const routine of importedData.routines) {
            try {
                // Check if routine with same name exists
                const existing = await db.getFirstAsync(
                    'SELECT id FROM routine_items WHERE name = ?',
                    [routine.name]
                );

                if (existing) {
                    // Update existing routine
                    await updateRoutine(existing.id, {
                        category: routine.category,
                        scheduled_time: routine.scheduled_time,
                        is_enabled: routine.is_enabled,
                        order_index: routine.order_index,
                    });
                } else {
                    // Add new routine
                    await addRoutine({
                        name: routine.name,
                        category: routine.category,
                        scheduledTime: routine.scheduled_time,
                        isEnabled: routine.is_enabled === 1,
                        order: routine.order_index,
                    });
                }
                routinesImported++;
            } catch (err) {
                console.error('Error importing routine:', routine.name, err);
            }
        }

        // Import completions
        let completionsImported = 0;
        if (importedData.completions) {
            for (const [date, completions] of Object.entries(importedData.completions)) {
                for (const completion of completions) {
                    try {
                        // Find routine by name (since IDs might be different)
                        const routine = await db.getFirstAsync(
                            'SELECT id FROM routine_items WHERE name = ?',
                            [completion.name]
                        );

                        if (routine) {
                            // Check if completion already exists
                            const existing = await db.getFirstAsync(
                                'SELECT id FROM routine_completions WHERE routine_id = ? AND date = ?',
                                [routine.id, date]
                            );

                            if (!existing) {
                                await db.runAsync(
                                    'INSERT INTO routine_completions (routine_id, date) VALUES (?, ?)',
                                    [routine.id, date]
                                );
                                completionsImported++;
                            }
                        }
                    } catch (err) {
                        console.error('Error importing completion:', err);
                    }
                }
            }
        }

        return {
            success: true,
            message: `✅ Import successful!\n\n${routinesImported} routines imported\n${completionsImported} completions restored`,
            stats: {
                routines: routinesImported,
                completions: completionsImported,
            },
        };
    } catch (error) {
        console.error('Error importing data:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';
import { getEnabledRoutines, getCompletionsForDate } from '../database/queries';
import { getUserName } from '../database/userSettings';
import { getTodayDateString } from '../utils/dateHelpers';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { db, dbLoading } = useDatabase();
    const [selectedDate, setSelectedDate] = useState(getTodayDateString());
    const [routines, setRoutines] = useState([]);
    const [completions, setCompletions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');

    // Load user name on mount, but only after database is ready
    useEffect(() => {
        if (db && !dbLoading) {
            loadUserName();
        }
    }, [db, dbLoading]);

    // Load data when database is ready or date changes
    useEffect(() => {
        if (!db || dbLoading) return;
        loadData();
    }, [db, dbLoading, selectedDate]);

    const loadUserName = async () => {
        if (!db || dbLoading) return;
        try {
            const name = await getUserName();
            setUserName(name || '');
        } catch (error) {
            console.error('Error loading user name:', error);
        }
    };

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [routinesData, completionsData] = await Promise.all([
                getEnabledRoutines(),
                getCompletionsForDate(selectedDate),
            ]);

            setRoutines(routinesData);
            setCompletions(completionsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const refresh = () => {
        loadData();
        loadUserName();
    };

    const changeDate = (date) => {
        setSelectedDate(date);
    };

    const completionPercentage = routines.length > 0
        ? Math.round((completions.length / routines.length) * 100)
        : 0;

    const value = {
        selectedDate,
        changeDate,
        routines,
        completions,
        completionPercentage,
        isLoading,
        refresh,
        userName,
        setUserName,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

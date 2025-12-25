import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeDatabase } from '../database/schema';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
    const [db, setDb] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const setupDatabase = async () => {
            try {
                setIsLoading(true);
                const database = await initializeDatabase();
                setDb(database);
                setError(null);
            } catch (err) {
                console.error('Database initialization error:', err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        setupDatabase();
    }, []);

    return (
        <DatabaseContext.Provider value={{ db, isLoading, error }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within DatabaseProvider');
    }
    return context;
};

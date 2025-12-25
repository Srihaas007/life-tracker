import * as SQLite from 'expo-sqlite';
import { DB_NAME, DEFAULT_ROUTINES } from '../utils/constants';

// Singleton database instance
let dbInstance = null;

/**
 * Initialize and get database instance (singleton)
 */
export const getDatabase = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  return dbInstance;
};

/**
 * SQL for creating all tables
 */
const CREATE_TABLES_SQL = `
  PRAGMA journal_mode = WAL;
  
  CREATE TABLE IF NOT EXISTS routine_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    scheduled_time TEXT,
    is_enabled INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS routine_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    time_spent INTEGER DEFAULT 0,
    FOREIGN KEY (routine_id) REFERENCES routine_items(id),
    UNIQUE(routine_id, date)
  );
  
  CREATE TABLE IF NOT EXISTS daily_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL,
    exercise_done INTEGER DEFAULT 0,
    notes TEXT,
    mood TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS weight_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL,
    weight REAL NOT NULL,
    unit TEXT DEFAULT 'kg',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS reading_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    book_title TEXT,
    minutes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS project_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT NOT NULL,
    date TEXT NOT NULL,
    hours_logged REAL DEFAULT 0,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_name, date)
  );

  CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_completions_date ON routine_completions(date);
  CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(date);
`;

/**
 * Initialize database with tables and default data
 */
export const initializeDatabase = async () => {
  try {
    const db = await getDatabase();

    // Create all tables
    await db.execAsync(CREATE_TABLES_SQL);

    // Check if this is a fresh install by seeing if there are any routines
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM routine_items');

    if (result.count === 0) {
      // Fresh install - populate default routines
      console.log('Populating default routines...');
      for (const routine of DEFAULT_ROUTINES) {
        await db.runAsync(
          `INSERT INTO routine_items (name, category, scheduled_time, is_enabled, order_index)
           VALUES (?, ?, ?, 1, ?)`,
          [routine.name, routine.category, routine.scheduledTime, routine.order]
        );
      }
      console.log('Default routines populated');
    } else {
      // Existing database - check for migrations
      console.log('Checking for migrations...');

      // Migration: Ensure user_settings table exists
      const tableCheck = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='user_settings'"
      );

      if (!tableCheck) {
        console.log('Creating user_settings table...');
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS user_settings (
            id INTEGER PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            value TEXT,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('user_settings table created');
      }
    }

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

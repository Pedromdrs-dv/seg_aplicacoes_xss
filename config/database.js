// Database configuration
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Initialize database tables
const initializeDatabase = () => {
    // Create users table if not exists
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table initialized');
            
            // Check if default admin user exists, if not create it
            db.get('SELECT * FROM users WHERE username = ?', ['admin'], (err, row) => {
                if (err) {
                    console.error('Error checking for default user:', err);
                } else if (!row) {
                    // Insert default admin user if it doesn't exist
                    db.run('INSERT INTO users (username, password) VALUES (?, ?)',
                        ['admin', 'admin'], 
                        (err) => {
                            if (err) {
                                console.error('Error creating default user:', err);
                            } else {
                                console.log('Default admin user created');
                            }
                        });
                }
            });
        }
    });
    
    // Create messages table if not exists
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_sanitized BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error('Error creating messages table:', err);
        } else {
            console.log('Messages table initialized');
        }
    });
};

module.exports = {
    db,
    initializeDatabase
};

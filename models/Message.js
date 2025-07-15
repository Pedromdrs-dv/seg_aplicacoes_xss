// Message model for database operations
const { db } = require('../config/database');

class Message {
    // Initialize the messages table
    static initTable() {
        return new Promise((resolve, reject) => {
            db.run(`CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_sanitized BOOLEAN DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    // Create a new message
    static create(userId, content, isSanitized = false) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO messages (user_id, content, is_sanitized) VALUES (?, ?, ?)',
                [userId, content, isSanitized ? 1 : 0],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            user_id: userId,
                            content,
                            is_sanitized: isSanitized
                        });
                    }
                }
            );
        });
    }

    // Get all messages, optionally filtered by sanitization status
    static getAll(isSanitized = null) {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT m.id, m.content, m.created_at, m.is_sanitized, u.username 
                FROM messages m 
                JOIN users u ON m.user_id = u.id
            `;
            
            const params = [];
            if (isSanitized !== null) {
                query += ' WHERE m.is_sanitized = ?';
                params.push(isSanitized ? 1 : 0);
            }
            
            query += ' ORDER BY m.created_at DESC';
            
            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Delete a message by ID
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM messages WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
}

module.exports = Message;

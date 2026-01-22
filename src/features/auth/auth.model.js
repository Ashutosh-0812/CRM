const { pool } = require('../../config/database');

class User {
  static async create(userData) {
    const { name, email, password, role = 'user' } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, userData) {
    const { name, email, role } = userData;
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async saveRefreshToken(userId, refreshToken) {
    const [result] = await pool.execute(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [refreshToken, userId]
    );
    return result.affectedRows;
  }

  static async findByRefreshToken(refreshToken) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE refresh_token = ?',
      [refreshToken]
    );
    return rows[0];
  }

  static async clearRefreshToken(userId) {
    const [result] = await pool.execute(
      'UPDATE users SET refresh_token = NULL WHERE id = ?',
      [userId]
    );
    return result.affectedRows;
  }
}

module.exports = User;

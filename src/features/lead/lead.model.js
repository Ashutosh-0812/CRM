const { pool } = require('../../config/database');

class Lead {
  static async create(leadData) {
    const { name, email, phone, company, source, status = 'new', notes, assigned_to } = leadData;
    const [result] = await pool.execute(
      'INSERT INTO leads (name, email, phone, company, source, status, notes, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, company, source, status, notes, assigned_to]
    );
    return result.insertId;
  }

  static async findAll(page = 1, limit = 10, search = '', status = '') {
    const offset = (page - 1) * limit;
    // Ensure limit and offset are integers
    const limitInt = parseInt(limit) || 10;
    const offsetInt = parseInt(offset) || 0;
    
    let query = 'SELECT * FROM leads';
    let countQuery = 'SELECT COUNT(*) as total FROM leads';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR company LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ` ORDER BY created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;
    
    const [rows] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, params);
    
    return {
      data: rows,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM leads WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, leadData) {
    const { name, email, phone, company, source, status, notes, assigned_to } = leadData;
    const [result] = await pool.execute(
      'UPDATE leads SET name = ?, email = ?, phone = ?, company = ?, source = ?, status = ?, notes = ?, assigned_to = ? WHERE id = ?',
      [name, email, phone, company, source, status, notes, assigned_to, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Lead;

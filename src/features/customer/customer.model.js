const { pool } = require('../../config/database');

class Customer {
  static async create(customerData) {
    const { name, email, phone, company, address, status = 'active', created_by } = customerData;
    const [result] = await pool.execute(
      'INSERT INTO customers (name, email, phone, company, address, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, company, address, status, created_by]
    );
    return result.insertId;
  }

  static async findAll(page = 1, limit = 10, search = '') {
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit) || 10;
    const offsetInt = parseInt(offset) || 0;
    
    let query = 'SELECT * FROM customers';
    let countQuery = 'SELECT COUNT(*) as total FROM customers';
    const params = [];

    if (search) {
      const searchCondition = ' WHERE name LIKE ? OR email LIKE ? OR company LIKE ?';
      query += searchCondition;
      countQuery += searchCondition;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
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
    const [rows] = await pool.execute('SELECT * FROM customers WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, customerData) {
    const { name, email, phone, company, address, status } = customerData;
    const [result] = await pool.execute(
      'UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, address = ?, status = ? WHERE id = ?',
      [name, email, phone, company, address, status, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Customer;

const bcrypt = require('bcrypt');
const pool = require('../db/pool'); // Kết nối MySQL

const createUser = async (email, password, name) => {
    // Hash mật khẩu
    const hash = await bcrypt.hash(password, 10);

    // Lưu vào DB
    await pool.query(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
        [email, hash, name]
    );
}

const getUser = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length === 0 ? null : rows[0]
}
module.exports = {
    createUser, getUser
}
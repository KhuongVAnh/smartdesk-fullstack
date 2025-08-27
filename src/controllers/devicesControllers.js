const pool = require('../db/pool');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { device_uid, name } = req.body;
    if (!device_uid) {
      return res.status(400).json({ error: 'device_uid required' });
    }

    // Tạo token random
    const token = crypto.randomBytes(16).toString('hex');

    // Lưu vào DB (nếu chưa có)
    await pool.query(
      `INSERT INTO devices (device_uid, name, token, last_seen)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE name=VALUES(name), token=VALUES(token), last_seen=NOW()`,
      [device_uid, name || null, token]
    );

    res.json({ device_uid, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

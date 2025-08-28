const pool = require('../db/pool');

exports.ingest = async (req, res) => {
  try {
    // Lấy token từ header Authorization
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Tìm thiết bị có token này
    const [devices] = await pool.query(
      'SELECT id FROM devices WHERE token = ?',
      [token]
    );

    if (devices.length === 0) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const device_id = devices[0].id;

    // Lấy dữ liệu cảm biến từ body
    const { temperature, humidity, light, noise } = req.body;

    if (temperature == null || humidity == null) {
      return res.status(400).json({ error: 'temperature and humidity required' });
    }

    // Lưu vào bảng readings
    await pool.query(
      `INSERT INTO readings (device_id, ts, temperature, humidity, light, noise)
       VALUES (?, NOW(), ?, ?, ?, ?)`,
      [device_id, temperature, humidity, light || 0, noise || 0]
    );

    // Cập nhật last_seen
    await pool.query(`UPDATE devices SET last_seen = NOW() WHERE id = ?`, [device_id]);

    // Emit sự kiện realtime tới client
    const io = req.app.get('io'); // req có reference đến app nên có thể dùng .app, io là 1 biến được app lưu
    io.emit('new-reading', {  // tạo 1 sự kiện gửi có tên new-reading, nếu client muốn nhận cần gọi đúng tên sk muốn nhận: on(new-reading)
      device_id,
      temperature,
      humidity,
      light: light || 0,
      noise: noise || 0,
      ts: new Date().toISOString()
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const pool = require('../db/pool');
const crypto = require('crypto');

const genAllReadings = async (req, res) => {
    try {
        const deviceId = req.params.device_id;

        const [readings] = await pool.query(
            'SELECT * FROM readings WHERE device_id = ? ORDER BY ts DESC LIMIT 50',
            [deviceId]
        );

        res.json(readings); // trả về JSON thay vì render EJS
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

const genLastestReading = async (req, res) => {
    try {
        const deviceId = req.params.device_id;

        const [rows] = await pool.query(
            'SELECT * FROM readings WHERE device_id = ? ORDER BY ts DESC LIMIT 1',
            [deviceId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No readings found' });
        }

        res.json(rows[0]); // chỉ trả về 1 object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

const genReadingByDate = async (req, res) => {
    try {
        const deviceId = req.params.device_id;
        const { start, end } = req.query; // ví dụ ?start=2025-08-28&end=2025-08-29

        const [rows] = await pool.query(
            'SELECT * FROM readings WHERE device_id = ? AND ts BETWEEN ? AND ? ORDER BY ts ASC',
            [deviceId, start, end]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    genAllReadings,
    genLastestReading, genReadingByDate
}

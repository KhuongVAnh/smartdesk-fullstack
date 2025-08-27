const pool = require('../db/pool'); // thêm để query DB

// lấy các thiết bị đo
const getAllDevices = async () => {
  const [devices] = await pool.query('SELECT * FROM devices');
  return devices
}

const getDeviceById = async (id) =>{
  const [device] = await pool.query('SELECT * FROM devices WHERE id = ?', [id]);
  return device
}

const getAllReadingsById = async (id) => {

  // Lấy readings của thiết bị
  const [readings] = await pool.query(
    'SELECT * FROM readings WHERE device_id = ? ORDER BY ts DESC LIMIT 20',
    [id]
  );

  return readings
}

module.exports = {
  getAllDevices, getDeviceById, getAllReadingsById
}
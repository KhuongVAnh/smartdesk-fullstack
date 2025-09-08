const pool = require('../db/pool'); // thêm để query DB

// lấy các thiết bị đo
const getAllDevices = async () => {
  const [devices] = await pool.query('SELECT * FROM devices');
  return devices
}

const getDeviceById = async (id) => {
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

const addNewDeviceToDB = async (device_uid, name, token) => {
  await pool.query(
    `INSERT INTO devices (device_uid, name, token, last_seen)
       VALUES (?, ?, ?, NOW())`,
    [device_uid, name, token]
  );
}

const updateDeviceNameByID = async (newName, id) => {
  await pool.query(
    'UPDATE devices SET name = ? WHERE id = ?',
    [newName, id]
  );
}

const deleteDeviceByID = async (id) => {
  await pool.query('DELETE FROM devices WHERE id = ?', [id]);
}

module.exports = {
  getAllDevices, getDeviceById, getAllReadingsById,
  addNewDeviceToDB, updateDeviceNameByID, deleteDeviceByID
}
const { addNewDeviceToDB } = require('./CRUDservices')
const crypto = require('crypto');

const createDevice = async (device_uid, name) => {
    const token = crypto.randomBytes(16).toString('hex');
    await addNewDeviceToDB(device_uid, name, token)
}

module.exports = {
    createDevice
}
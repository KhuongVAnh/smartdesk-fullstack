const { getAllDevices, getDeviceById, getAllReadingsById,
    updateDeviceNameByID, deleteDeviceByID
} = require('../services/CRUDservices')
const { createDevice } = require('../services/helps')

const getHomePage = (req, res) => {
    res.render('index.ejs', { title: 'Smartdesk Project' });
}

const getDashboardPage = async (req, res) => {
    try {
        const devices = await getAllDevices();
        res.render('dashboard', { devices });
    } catch (err) {
        console.error(err);
        res.send('Error loading dashboard');
    }
}

const getReadingsPage = async (req, res) => {
    try {
        const deviceId = req.params.device_id;

        // Lấy thông tin thiết bị
        const devices = await getDeviceById(deviceId)
        if (devices.length === 0) {
            return res.send('Device not found');
        }
        const device = devices[0];

        // Lấy readings của thiết bị
        const readings = await getAllReadingsById(deviceId)

        res.render('readings', { device, readings });
        // console.log(">>>device: ",device,"  >>>readings: ", readings)
    } catch (err) {
        console.error(err);
        res.send('Error loading readings');
    }
}

const getDeviceListPage = async (req, res) => {
    try {
        const devices = await getAllDevices();
        res.render('devices', { devices });
    } catch (err) {
        console.error(err);
        res.send('Error loading dashboard');
    }
}

const getAddDevicePage = (req, res) => {
    res.render('device_addNew.ejs')
}

const postNewDevice = (req, res) => {
    try {
        const { device_uid, name } = req.body;
        createDevice(device_uid, name)
        res.redirect('/devices');
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi thêm thiết bị");
    }
}

const getEditDevicePage = async (req, res) => {
    try {
        const deviceId = req.params.id;
        const device = await getDeviceById(deviceId)
        if (device.length === 0) return res.send("Thiết bị không tồn tại");

        res.render('device_edit', { device: device[0] });
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi load thiết bị");
    }
}

const postEditDevice = async (req, res) => {
    try {
        const deviceId = req.params.id;
        const { name } = req.body;

        await updateDeviceNameByID(name, deviceId)

        res.redirect('/devices');
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi cập nhật thiết bị");
    }
}

const getDeleteAction = async (req, res) => {
    try {
        const deviceId = req.params.id;
        await deleteDeviceByID(deviceId)
        res.redirect('/devices');
    } catch (err) {
        console.error(err);
        res.send("Lỗi khi xóa thiết bị");
    }
}
module.exports = {
    getHomePage, getDashboardPage, getReadingsPage,
    getDeviceListPage, getAddDevicePage, postNewDevice,
    getEditDevicePage, postEditDevice, getDeleteAction
}
const { getAllDevices, getDeviceById, getAllReadingsById } = require('../services/CRUDservices')

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

module.exports = {
    getHomePage, getDashboardPage, getReadingsPage
}
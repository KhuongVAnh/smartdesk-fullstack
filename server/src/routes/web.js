const express = require('express');
const router = express.Router();
const { getHomePage, getDashboardPage, getReadingsPage,
    getDeviceListPage, getAddDevicePage, postNewDevice,
    getEditDevicePage, postEditDevice, getDeleteAction } = require('../controllers/pageController')
const { isAuthenticated } = require('../middlewares/auth');

// route homepage
router.get('/', getHomePage);

// hiển thị thiết bị
router.get('/dashboard', isAuthenticated, getDashboardPage);

//lấy hiện thông tin từ thiết bị
router.get('/readings/:device_id', getReadingsPage);

router.get('/devices', getDeviceListPage)

router.get('/devices/new', getAddDevicePage)

router.post('/devices/new', postNewDevice)

router.get('/devices/edit/:id', getEditDevicePage)

router.post('/devices/edit/:id', postEditDevice)

router.get('/devices/delete/:id', getDeleteAction)

module.exports = router
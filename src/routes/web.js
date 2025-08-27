const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // thêm để query DB
const { getHomePage, getDashboardPage, getReadingsPage } = require('../controllers/pageController')

// route homepage
router.get('/', getHomePage);

// hiển thị thiết bị
router.get('/dashboard', getDashboardPage);


//lấy hiện thông tin từ thiết bị
router.get('/readings/:device_id', getReadingsPage);

module.exports = router
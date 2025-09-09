const path = require('path');
const express = require('express');         // 👈 gắn socket.io vào server


let configViewEngine = (app) => {
    // cấu hình EJS
    app.set('views', path.join('./src', 'views'));
    app.set('view engine', 'ejs');

    // phục vụ file tĩnh trong thư mục public
    app.use(express.static(path.join('./src', 'public')));

}

module.exports = configViewEngine;

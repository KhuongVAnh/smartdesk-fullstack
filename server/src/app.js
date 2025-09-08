require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const flash = require('connect-flash');


const app = express();
const server = http.createServer(app);   // 👈 tạo server http từ express
const io = new Server(server);           // 👈 gắn socket.io vào server

// cấu hình EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Make io available globally (để controller có thể emit event)
app.set('io', io);


// phục vụ file tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // để đọc JSON body
app.use(express.urlencoded({ extended: true }));


// route
const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web')
app.use('/api/v1', apiRoutes);
app.use(webRoutes)

// start server
const PORT = process.env.PORT || 3000;


// phục vụ cho login
// Khai báo session middleware, MỤC ĐÍCH LÀ ĐỂ TẠO PHIÊN ĐĂNG NHẬP
app.use(session({
  secret: process.env.SECRET_SESSION_KEY,  // 🔑 chuỗi bí mật để mã hóa session
  resave: false,                   // không lưu lại session nếu không thay đổi
  saveUninitialized: false         // không lưu session trống
}));

// Khai báo flash để dùng message, DÙNG ĐỂ TẠO THÔNG BÁO KHI LOGIN THÀNH CÔNG
app.use(flash());

// Middleware: để EJS có thể sử dụng message và user
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg'); // thông báo thành công
  res.locals.error_msg = req.flash('error_msg');     // thông báo lỗi
  res.locals.user = req.session.user || null;        // thông tin user đang login
  next();
});


const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

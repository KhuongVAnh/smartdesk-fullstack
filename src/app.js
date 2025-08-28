require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');


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

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

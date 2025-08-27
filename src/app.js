require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db/pool'); // thêm để query DB

const app = express();

// cấu hình EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// phục vụ file tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // để đọc JSON body

const apiRoutes = require('./routes/api');
const webRoutes =require('./routes/web')
app.use('/api/v1', apiRoutes);
app.use(webRoutes)

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

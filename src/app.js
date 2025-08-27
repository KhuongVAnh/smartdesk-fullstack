require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// cấu hình EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// phục vụ file tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // để đọc JSON body

const apiRoutes = require('./routes/api');
app.use('/api/v1', apiRoutes);

// route test
app.get('/', (req, res) => {
  res.render('index', { title: 'Smartdesk Project' });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

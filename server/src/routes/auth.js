const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool'); // Kết nối MySQL
const router = express.Router();

// ============ REGISTER ============

// GET register
router.get('/register', (req, res) => {
  res.render('login_register'); // hiển thị form register.ejs
});

// POST register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    req.flash('error_msg', 'Email và mật khẩu là bắt buộc');
    return res.redirect('/auth/register');
  }

  try {
    // Hash mật khẩu
    const hash = await bcrypt.hash(password, 10);

    // Lưu vào DB
    await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, hash, name]
    );

    req.flash('success_msg', 'Đăng ký thành công, hãy đăng nhập');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Email đã tồn tại hoặc lỗi server');
    res.redirect('/auth/register');
  }
});

// ============ LOGIN ============

// GET login
router.get('/login', (req, res) => {
  res.render('login_register'); // hiển thị form login.ejs
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      req.flash('error_msg', 'Không tìm thấy người dùng');
      return res.redirect('/auth/login');
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      req.flash('error_msg', 'Sai mật khẩu');
      return res.redirect('/auth/login');
    }

    // Lưu user vào session
    req.session.user = user;
    req.flash('success_msg', 'Đăng nhập thành công');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Lỗi server');
    res.redirect('/auth/login');
  }
});

// ============ LOGOUT ============

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;

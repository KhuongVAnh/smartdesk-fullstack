const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool'); // Kết nối MySQL
const router = express.Router();
const {createUser, getUser} = require('../services/userServices')

// ============ REGISTER ============

// GET register
router.get('/login-register', (req, res) => {
  res.render('login_register'); // hiển thị form register.ejs
});

// POST register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    req.flash('error_msg', 'Email và mật khẩu là bắt buộc');
    return res.redirect('/auth/login-register');
  }

  try {
    await createUser(email, password, name)

    req.flash('success_msg', 'Đăng ký thành công, hãy đăng nhập');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Email đã tồn tại hoặc lỗi server');
    res.redirect('/auth/login-register');
  }
});

// ============ LOGIN ============

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUser(email);

    if (user === null) {
      req.flash('error_msg', 'Không tìm thấy người dùng');
      return res.redirect('/auth/login-register');
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      req.flash('error_msg', 'Sai mật khẩu');
      return res.redirect('/auth/login-register');
    }

    // Lưu user vào session
    req.session.user = user;
    req.flash('success_msg', 'Đăng nhập thành công');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Lỗi server');
    res.redirect('/auth/login-register');
  }
});

// ============ LOGOUT ============

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login-register');
  });
});

module.exports = router;

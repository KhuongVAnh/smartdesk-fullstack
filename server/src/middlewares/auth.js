function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        // Nếu đã đăng nhập
        return next();
    }
    // Nếu chưa đăng nhập → chuyển sang login
    req.flash('error_msg', 'Bạn phải đăng nhập trước');
    res.redirect('/auth/login-register');
}

module.exports = { isAuthenticated };

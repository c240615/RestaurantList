
module.exports = {
  authenticator: (req, res, next) => {
    // 根據 request 的登入狀態回傳 true 或 false
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("warning_msg", "請完成登入");
    res.redirect("/users/login");
  },
};

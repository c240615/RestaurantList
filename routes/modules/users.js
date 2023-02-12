const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../../models/user");

// 取得登入頁
router.get("/login", (req, res) => {
  res.render("login");
});

// 提交登入表單
// 加入 middleware，驗證 request 登入狀態
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

// 取得註冊頁
router.get("/register", (req, res) => {
  res.render("register");
});

// 提交註冊表單
router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  if (!email || !password || !confirmPassword) {
    errors.push({ message: "請輸入正確的電子信箱及密碼" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與確認密碼不相符！" });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }
  return User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ message: "這個 Email 已經註冊過了。" });
      return res.render("register", {
        errors,
        name,
        email,
        password,
        confirmPassword,
      });
    }
    return bcrypt
      .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
      .then((salt) => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash, // 用雜湊值取代原本的使用者密碼
        })
      )
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  });
});

// 登出
router.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    req.flash("success_msg", "成功登出!");
    res.redirect("/users/login");
  });
});

module.exports = router;

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
router.post("/register", (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!email || !password || !confirmPassword) {
    errors.push({ message: "帳密欄位都是必填" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與確認密碼不相符" });
  }
  if (errors.lengh) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.push({ message: "此 Email 已註冊!" });
        return res.render("register", {
          errors,
          name,
          email,
          password,
          confirmPassword,
        });
      }
      return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      User.create({
        email,
        password,
      })
        .then(() => res.redirect("/"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

/*
router.post('/register', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  if (!email || !password || !confirmPassword) throw new Error('Email and Password is required!')
  if (password !== confirmPassword) throw new Error('Password do not match!')
  return User.findOne({ email })
    .then(user => {
      if (user) throw new Error('User already exists!')
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))
    })
    .catch(err => next(err))
})
*/

// 登出
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "成功登出!");
  res.redirect("/users/login");
});

module.exports = router;

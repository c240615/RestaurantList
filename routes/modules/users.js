const express = require("express");
const passport = require("passport");
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
router.post("/register", (req, res,next) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {       
        console.log("User already exists.");
        res.render("register", {
          name,
          email,
          password,
          confirmPassword,
        });
      } else {
        return User.create({          
          email,
          password,
        })
          .then(() => res.redirect("/"))
          .catch((err) => console.log(err));
      }
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
  res.redirect("/users/login");
});

module.exports = router;

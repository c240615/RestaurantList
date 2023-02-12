const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const routes = require("./routes");
const usePassport = require("./config/passport");

require("./config/mongoose");

const app = express();
const port = 3000;

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);

usePassport(app);

app.use(flash());

// middleware 一定要用 next 結束 進入下一個 middleware
app.use((req, res, next) => {
  //console.log(req.user);
  //console.log(req.isAuthenticated());
  // req.isAuthenticated() 回傳的布林值
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg"); // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash("warning_msg"); // 設定 warning_msg 訊息
  next();
});

app.use(routes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on localhost:${port}`);
});

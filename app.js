const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const usePassport = require("./config/passport");
const routes = require("./routes");
const bodyParser = require("body-parser");
require("./config/mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

// middleware 一定要用 next 結束 進入下一個 middleware
app.use((req, res, next) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  // req.isAuthenticated() 回傳的布林值
  res.locals.isAuthenticated = req.isAuthenticated();
  // req.user 存放使用者資料
  res.locals.user = req.user;
  next();
});

app.use(routes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on localhost:${port}`);
});

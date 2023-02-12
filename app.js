const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

usePassport(app);

app.use(flash());

app.use((req, res, next) => { 
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg"); 
  res.locals.warning_msg = req.flash("warning_msg"); 
  next();
});

app.use(routes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on localhost:${port}`);
});

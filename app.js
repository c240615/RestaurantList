const express = require("express");
const app = express();
const exphbs = require("express-handlebars");

const mongoose = require('mongoose')


// const restaurantList = require("./restaurant.json");

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

// mongodb+srv://claire:<password>@cluster0.fovij.mongodb.net/restaurant?retryWrites=true&w=majority
/*mongoose.connect("mongodb://localhost:27017/restaurant", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('connected.')
})
.catch((err) => {  
  console.log('connection failed.')
})*/
const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


db.on('error', () => {
  console.error('mongoDB error')
})

db.once('open',()=>{
  console.log("mongoDB open");
})

// 首頁目錄
app.get("/", (req, res) => {
  res.render("index"); //, { restaurants: restaurantList.results }
});

// show 頁面
app.get("/restaurant/:restaurant_id", (req, res) => {
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id === Number(req.params.restaurant_id)
  );
  res.render("show", { restaurant: restaurant });
});

// search 結果
app.get("/search", (req, res) => {
  if (!req.query.keyword) {
    return res.redirect("/");
  }
  const restaurants = restaurantList.results.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase()) ||
      restaurant.category
        .toLowerCase()
        .includes(req.query.keyword.toLowerCase())
    );
  });
  res.render("index", { restaurants: restaurants, keyword: req.query.keyword });
});

app.listen(3000, () => {
  console.log(`The express is running on localhost:3000`);
});

// set "MONGODB_URI=mongodb+srv://claire:c240615c@cluster0.qbfgku3.mongodb.net/restaurant?retryWrites=true&w=majority"
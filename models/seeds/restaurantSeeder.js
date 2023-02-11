const restaurantList = require("../../restaurant.json").results;

const Restaurant = require("../restaurant");
const db = require("../../config/mongoose");

require("dotenv").config();

db.once("open", () => {
  console.log("running");

  Restaurant.create(restaurantList)
    .then(() => {      
      db.close();
    })
    .catch((err) => console.log(err));
});

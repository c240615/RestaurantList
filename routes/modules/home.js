const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/Restaurant");
// 首頁
router.get("/", (req, res) => {
  const userId = req.user._id;
  // console.log(userId);
  Restaurant.find({ userId: userId })
    .lean()
    .sort({ _id: "asc" })
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((error) => console.error(error));
});

// 搜尋餐廳
router.get("/search", (req, res) => {
  const keywords = req.query.keyword;
  const keyword = req.query.keyword.toLowerCase().trim(); 
  Restaurant.find()
    .lean()
    .then((restaurantsData) => {
      const filterRestaurantsData = restaurantsData.filter((data) => {
        return (
          data.name.toLowerCase().includes(keyword) ||
          data.category.toLowerCase().includes(keyword)
        );
      });
      if (!filterRestaurantsData.length) {
        res.render("cannot_found", { restaurants: restaurantsData, keywords });
      } else {
        res.render("index", { restaurants: filterRestaurantsData, keyword });
      }
    });
});

module.exports = router;

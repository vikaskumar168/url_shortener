const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json("Welcom to url shortener");
  //return res.render("home")
});

module.exports = router;

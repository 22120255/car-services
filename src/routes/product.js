const express = require("express");
const router = express.Router();

const productController = require("../controllers/ProductController");

router.get("/detail/:id", productController.detailProduct);
router.get("/", productController.index);

module.exports = router;

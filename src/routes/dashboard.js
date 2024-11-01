const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/DashboardController");

router.get("/contact", dashboardController.contact);
router.get("/about-us", dashboardController.aboutUs);
router.get("/", dashboardController.index);

module.exports = router;

const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");

router.post("/orders", orderController.addOder);
router.post("/order_detail", orderController.addOderDetail);

module.exports = router;

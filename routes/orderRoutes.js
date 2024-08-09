const express = require("express");

const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const orderController = require("../controllers/orderController");

router.post("/orders", orderController.addOder);
router.post("/order_detail", orderController.addOderDetail);

// Route to get all orders of a user
router.get("/ordersUser/:userId", orderController.getUserOrders);
router.get("/order_detail/:orderId", orderController.getOrderDetails);
router.get("/admin/order", orderController.getOrderAll);
router.put(
  "/admin/order/:id/status",
  adminAuth,
  orderController.updateOrderStatus
);

module.exports = router;

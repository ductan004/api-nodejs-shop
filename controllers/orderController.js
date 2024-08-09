const orderModel = require("../models/orderModel");

exports.addOder = async (req, res) => {
  let data = req.body;
  try {
    const result = await orderModel.addOrder(data);
    res.json({
      message: "Order added successfully",
      id: result.insertId,
      code: data.code,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add order", details: err.message });
  }
};

exports.addOderDetail = async (req, res) => {
  let data = req.body;
  try {
    const result = await orderModel.addOrderDetail(data);
    res.json({
      message: "Order Detail added successfully",
      productId: result.insertId,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add order Detail", details: err.message });
  }
};

exports.getOrderAll = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Lấy giới hạn từ query, mặc định là 10
  const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1
  const offset = (page - 1) * limit; // Tính toán offset dựa trên trang

  try {
    const orders = await orderModel.getOrderAll(limit, offset);
    const totalOrders = await orderModel.getTotalOrdersCount(); // Lấy tổng số đơn hàng

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this status" });
    }

    res.json({
      page,
      limit,
      total: totalOrders,
      orders,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get orders", details: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await orderModel.getOrderByUserId(userId);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get orders", details: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  const orderId = req.params.orderId; // Extract orderId from params

  try {
    const orderDetails = await orderModel.getOrderDetailByOrderId(orderId);

    if (orderDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "No orderDetail found for this order" });
    }
    res.json(orderDetails);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get order details", details: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;
  try {
    const result = await orderModel.updateOrderStatus(orderId, status);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update order", details: err.message });
  }
};

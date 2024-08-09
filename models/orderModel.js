const db = require("../config/db");

const addOrder = async (orderData) => {
  try {
    const sql = "INSERT INTO orders SET ?";
    const [result] = await db.query(sql, orderData);
    return result;
  } catch (err) {
    throw new Error(`Failed to add order : ${err.message}`);
  }
};

const addOrderDetail = async (orderDetailData) => {
  try {
    let sql = "INSERT INTO order_detail SET ?";
    const [result] = await db.query(sql, orderDetailData);
    return result;
  } catch (err) {
    throw new Error(`Failed to add orders : ${err.message}`);
  }
};

const getOrderAll = async (limit, offset) => {
  try {
    let sql = `SELECT * FROM orders ORDER BY status ASC LIMIT ? OFFSET ?`;
    const [result] = await db.query(sql, [limit, offset]);
    return result;
  } catch (err) {
    throw new Error(`Failed to get orders  ${err.message}`);
  }
};

const getTotalOrdersCount = async () => {
  try {
    const sql = "SELECT COUNT(*) AS total FROM orders";
    const [result] = await db.query(sql);
    return result[0].total;
  } catch (err) {
    throw new Error(`Failed to get total orders count: ${err.message}`);
  }
};

const getOrderByUserId = async (userId) => {
  try {
    let sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY createAt DESC";
    const [result] = await db.query(sql, [userId]);
    return result;
  } catch (err) {
    throw new Error(`Failed to get orders by user id: ${err.message}`);
  }
};

const getOrderDetailByOrderId = async (orderId) => {
  try {
    let sql = "SELECT * FROM order_detail WHERE order_id = ? ORDER BY id DESC";
    const [result] = await db.query(sql, orderId);
    return result;
  } catch {
    throw new Error(`Failed to get order details by order id: ${err.message}`);
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    let sql = "UPDATE orders SET status = ? WHERE id = ?";
    const [result] = await db.query(sql, [status, orderId]);
    if (result.affectedRows === 0) {
      console.log("No rows updated, please check the order ID.");
    }
    return result;
  } catch (err) {
    throw new Error(`Failed to update order status: ${err.message}`);
  }
};

module.exports = {
  addOrder,
  addOrderDetail,
  getOrderByUserId,
  getOrderDetailByOrderId,
  getOrderAll,
  getTotalOrdersCount,
  updateOrderStatus,
};

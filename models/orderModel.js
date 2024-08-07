const db = require("../config/db");

const addOder = async (orderData) => {
  try {
    const sql = "INSERT INTO orders SET ?";
    const [result] = await db.query(sql, orderData);
    return result;
  } catch (err) {
    throw new Error(`Failed to add order : ${err.message}`);
  }
};

const addOderDetail = async (orderDetailData) => {
  try {
    let sql = "INSERT INTO order_detail SET ?";
    const [result] = await db.query(sql, orderDetailData);
    return result;
  } catch (err) {
    throw new Error(`Failed to add orders : ${err.message}`);
  }
};

module.exports = {
  addOder,
  addOderDetail,
};

const orderModel = require("../models/orderModel");

exports.addOder = async (req, res) => {
  let data = req.body;
  try {
    const result = await orderModel.addOder(data);
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
    const result = await orderModel.addOderDetail(data);
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

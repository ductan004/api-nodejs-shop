const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productRoutes = require("./routes/productRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
app.get("/", (req, res) => {
  res.json({ message: "ket noi thanh cong nodejs" });
});

app.use("/api/v1/", productRoutes);
app.use("/api/v1/", catalogRoutes);
app.use("/api/v1/", orderRoutes);
app.use("/api/v1/", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

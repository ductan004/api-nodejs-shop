const cloudinary = require("cloudinary").v2;

const productModel = require("../models/productModel");
const { error } = require("console");
// Fetch all products
exports.fetchProducts = async (req, res) => {
  const limi = parseInt(req.params.limi || 6);
  try {
    const data = await productModel.getProducts(limi);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
};

exports.fetchProductHot = async (req, res) => {
  const limi = parseInt(req.params.limi || 8);
  try {
    const data = await productModel.getProductHot(limi);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product Hot", error: err });
  }
};

exports.fetchProductSale = async (req, res) => {
  const limi = parseInt(req.params.limi || 8);
  try {
    const data = await productModel.getProductSale(limi);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product Sale", error: err });
  }
};

exports.fetchProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (id <= 0 || isNaN(id)) {
    return res.status(400).json({ error: "Invalid product ID", id });
  }
  try {
    const data = await productModel.getProductById(id);
    if (data.length === 0) {
      return res.status(404).json({ error: "Product not found", id });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product details", error: err.message });
  }
};

exports.fetchProductByCatalog = async (req, res) => {
  let limi = parseInt(req.params.limi || 6);
  const id_catalog = parseInt(req.params.id_catalog);
  if (isNaN(id_catalog) || id_catalog <= 0) {
    return res.status(400).json({ message: "Invalid product id_catalog", id_catalog });
  }
  try {
    const data = await productModel.getProductsByCatalog(id_catalog, limi);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products by catalog", error: err.message });
  }
};

exports.fetchRelatedProducts = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid product ID", id });
  }

  try {
    const data = await productModel.getRelatedProducts(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching related products", error: err.message });
  }
};

// Admin fetch products
exports.fetchAdminProducts = async (req, res) => {
  const limi = parseInt(req.query.limi || 10);
  try {
    const data = await productModel.getAdminProducts(limi);
    res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching admin products", error: err });
  }
};

exports.addProduct = async (req, res) => {
  const { id_catalog, name, price, price_sale, sale, hot, des } = req.body;
  const img = req.file;

  if (!id_catalog || !name || !img) {
    return res.status(400).json({ error: "id_catalog, name, and img are required" });
  }

  const productData = {
    id_catalog,
    name,
    price: price || 0,
    price_sale: price_sale || 0,
    sale: sale || 0,
    hot: hot || 0,
    img: img.path,
    des: des || null,
    created_at: new Date(),
  };

  try {
    const result = await productModel.addProduct(productData);
    res.json({
      message: "Product added successfully",
      productId: result.insertId,
      imageUrl: img.path, // Trả về URL của ảnh
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product", details: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    await productModel.deleteProduct(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id_catalog, name, price, price_sale, sale, hot, des } = req.body;
  const id = parseInt(req.params.id);
  const img = req.file;

  if (!id_catalog || !name) {
    return res.status(400).json({ error: "id_catalog and name are required" });
  }

  try {
    const product = await productModel.getProductById(id);
    const oldImagePath = product.img;

    // Decode the URL to handle special characters
    const decodedUrl = decodeURIComponent(oldImagePath);

    const productData = {
      id_catalog,
      name,
      price: price || product.price,
      price_sale: price_sale || product.price_sale,
      sale: sale !== undefined ? sale : product.sale,
      hot: hot !== undefined ? hot : product.hot,
      des: des || product.des,
      created_at: new Date(),
    };

    if (img) {
      productData.img = img.path;
    }

    const publicId = decodedUrl
      .split("/")
      .slice(7)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    if (img) {
      cloudinary.uploader.destroy(publicId, (err) => {
        if (error) {
          console.error("Failed to delete old image file:", error);
        }
      });
    }

    await productModel.updateProduct(productData, id);

    res.json({
      message: "Product updated successfully",
      productId: id,
      publicId: publicId,
    });
  } catch {
    if (err.message === "Product not found") {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(500).json({ error: "Failed to update product", details: err.message });
    }
  }
};

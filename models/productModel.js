const { error } = require("console");
const db = require("../config/db"); // Ensure this uses mysql2 with promise support
const cloudinary = require("cloudinary").v2;
// Fetch all products
const getProducts = async (limit) => {
  try {
    const sql = "SELECT * FROM product ORDER BY created_at DESC LIMIT 0, ?";
    const [results] = await db.query(sql, [limit]);
    return results;
  } catch (err) {
    throw new Error(`Failed to fetch products: ${err.message}`);
  }
};

// Fetch hot products
const getProductHot = async (limit) => {
  try {
    const sql = "SELECT * FROM product WHERE hot = 1 ORDER BY created_at desc LIMIT 0, ?";
    const [results] = await db.query(sql, [limit]);
    return results;
  } catch (err) {
    throw new Error(`Failed to fetch hot products: ${err.message}`);
  }
};

// Fetch sale products
const getProductSale = async (limit) => {
  try {
    const sql = "SELECT * FROM product WHERE sale = 1 ORDER BY created_at desc LIMIT 0, ?";
    const [results] = await db.query(sql, [limit]);
    return results;
  } catch (err) {
    throw new Error(`Failed to fetch sale products: ${err.message}`);
  }
};

// Fetch product by ID
const getProductById = async (id) => {
  try {
    const sql =
      "SELECT product.*, catalog.name AS catalog_name FROM product JOIN catalog ON product.id_catalog = catalog.id WHERE product.id = ?";
    const [results] = await db.query(sql, [id]);
    if (results.length === 0) {
      throw new Error("Product not found");
    }
    return results[0]; // Assuming you want the first result
  } catch (err) {
    throw new Error(`Failed to fetch product by ID: ${err.message}`);
  }
};

// Fetch products by catalog ID
const getProductsByCatalog = async (catalogId, limit) => {
  try {
    const sqlCatalog = "SELECT * FROM catalog WHERE id = ?";
    const [catalog] = await db.query(sqlCatalog, [catalogId]);

    if (catalog.length === 0) {
      throw new Error(`Catalog with ID ${catalogId} does not exist`);
    }

    const sql = "SELECT * FROM product WHERE id_catalog = ? ORDER BY id DESC LIMIT ?";
    const [results] = await db.query(sql, [catalogId, limit]);
    return results;
  } catch (err) {
    throw new Error(`Failed to fetch products by catalog: ${err.message}`);
  }
};

// Fetch related products
const getRelatedProducts = async (productId) => {
  try {
    const sql = "SELECT id_catalog FROM product WHERE id = ?";
    const [results] = await db.query(sql, [productId]);

    if (results.length === 0) {
      throw new Error("Product not found");
    }

    const catalogId = results[0].id_catalog;

    const relatedSql = "SELECT * FROM product WHERE id_catalog = ? AND id != ?";
    const [relatedProducts] = await db.query(relatedSql, [catalogId, productId]);

    return relatedProducts;
  } catch (err) {
    throw new Error(`Failed to fetch related products: ${err.message}`);
  }
};

// Admin functions
const getAdminProducts = async (limit) => {
  try {
    const sql = "SELECT * FROM product ORDER BY created_at DESC LIMIT ?";
    const [result] = await db.query(sql, [limit]);
    return result;
  } catch (err) {
    throw new Error(`Failed to fetch admin products: ${err.message}`);
  }
};

// Add product
const addProduct = async (productData) => {
  try {
    const sql = "INSERT INTO product SET ?";
    const [result] = await db.query(sql, productData);
    return result;
  } catch (err) {
    throw new Error(`Failed to add product: ${err.message}`);
  }
};

// Delete product
const deleteProduct = async (productId) => {
  try {
    const selectSql = "SELECT img FROM product WHERE id = ?";
    const [results] = await db.query(selectSql, [productId]);

    if (results.length === 0) {
      throw new Error(`Product with ID ${productId} does not exist`);
    }

    const product = results[0];
    const oldImagePath = product.img; // Cloudinary URL is not a file path
    // Decode the URL to handle special characters
    const decodedUrl = decodeURIComponent(oldImagePath);

    const publicId = decodedUrl
      .split("/")
      .slice(7)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    const deleteSql = "DELETE FROM product WHERE id = ?";
    await db.query(deleteSql, [productId]);

    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        console.error("Failed to delete image file:", error);
      }
    });
  } catch (err) {
    throw new Error(`Failed to delete product: ${err.message}`);
  }
};

// Update product
const updateProduct = async (productData, id) => {
  try {
    const sql = "UPDATE product SET ? WHERE id = ?";
    const [result] = await db.query(sql, [productData, id]);
    if (result.affectedRows === 0) {
      throw new Error("Product not found");
    }
    return result;
  } catch (err) {
    throw new Error(`Failed to update product: ${err.message}`);
  }
};

module.exports = {
  getProducts,
  getProductHot,
  getProductSale,
  getProductById,
  getProductsByCatalog,
  getRelatedProducts,
  addProduct,
  getAdminProducts,
  deleteProduct,
  updateProduct,
};

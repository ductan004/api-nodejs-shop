const express = require("express");
const router = express.Router();

const upload = require("../config/uploadConfig");
const adminAuth = require("../middlewares/adminAuth");

const productController = require("../controllers/productController");

// User
router.get("/product/:limi?", productController.fetchProducts);
router.get("/productHot/:limi?", productController.fetchProductHot);
router.get("/productSale/:limi?", productController.fetchProductSale);
router.get("/productDetail/:id", productController.fetchProductById);
router.get("/productRelated/:id", productController.fetchRelatedProducts);
router.get("/productCatalog/:id_catalog", productController.fetchProductByCatalog);

// Admin routes
router.get("/admin/product", adminAuth, productController.fetchAdminProducts);
router.post("/admin/product", adminAuth, upload.single("img"), productController.addProduct);
router.put("/admin/product/:id", adminAuth, upload.single("img"), productController.updateProduct);
router.delete("/admin/product/:id", adminAuth, productController.deleteProduct);

module.exports = router;

const express = require("express");

const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const catalogController = require("../controllers/catalogController");

router.get("/catalog", catalogController.fetchCatalogs);
router.get("/catalog/:id", catalogController.fetchCatalogsId);

// Admin
router.post("/admin/catalog/", adminAuth, catalogController.addCatalog);
router.delete("/admin/catalog/:id", adminAuth, catalogController.deleteCatalog);
router.put("/admin/catalog/:id", adminAuth, catalogController.updateCatalog);

module.exports = router;

const catalogModel = require("../models/catalogModel");

exports.fetchCatalogs = async (req, res) => {
  try {
    const data = await catalogModel.getCatalogs();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
};

exports.fetchCatalogsId = async (req, res) => {
  const id = parseInt(req.params.id);
  if (id <= 0 || isNaN(id)) {
    return res.status(400).json({ error: "Invalid product ID", id });
  }
  try {
    const data = await catalogModel.getCatalogId(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching catalog details", error: err.message });
  }
};

exports.addCatalog = async (req, res) => {
  const { name } = req.body;
  const productData = {
    name,
  };
  try {
    const result = await catalogModel.addCatalog(productData);
    res.json({
      message: "Catalog added successfully",
      catalogId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add catalog", details: err.message });
  }
};

exports.deleteCatalog = async (req, res) => {
  const catalogId = parseInt(req.params.id);
  if (catalogId <= 0 || isNaN(catalogId)) {
    return res.status(400).json({ error: "Invalid catalog ID", id });
  }

  try {
    await catalogModel.deleteCatalog(catalogId);
    res.json({ message: "Catalog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete catalog", details: err.message });
  }
};

exports.updateCatalog = async (req, res) => {
  let catalogId = parseInt(req.params.id);
  if (catalogId <= 0 || isNaN(catalogId)) {
    return res.status(400).json({ error: "Invalid catalog ID", id });
  }

  const { name } = req.body;
  const productData = {
    name,
  };
  try {
    await catalogModel.updateCatalog(productData, catalogId);
    res.json({
      message: "Catalog update successfully",
      name: productData.name,
      catalogId: catalogId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update catalog", details: err.message });
  }
};

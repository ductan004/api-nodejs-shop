const db = require("../config/db");

const getCatalogs = async () => {
  try {
    const sql = "SELECT * FROM catalog ORDER BY id DESC";
    const [results] = await db.query(sql);
    return results;
  } catch (err) {
    throw new Error(`Failed to fetch catalogs: ${err.message}`);
  }
};

const getCatalogId = async (idCatalog) => {
  try {
    const sql = "SELECT * FROM catalog WHERE id = ?";
    const [result] = await db.query(sql, [idCatalog]);
    if (result.length === 0) {
      throw new Error(`Catalog width ID invalid ${idCatalog}`);
    }
    return result[0];
  } catch (err) {
    throw new Error(`Failed to fetch catalog by ID: ${err.message}`);
  }
};

const addCatalog = async (catalogData) => {
  try {
    const sql = "INSERT INTO catalog SET ?";
    const [result] = await db.query(sql, catalogData);
    return result;
  } catch (err) {
    throw new Error(`Failed to add catalog: ${err.message}`);
  }
};

const deleteCatalog = async (catalogId) => {
  try {
    // Check if catalog exists
    const checkSql = "SELECT * FROM catalog WHERE id = ?";
    const [result] = await db.query(checkSql, [catalogId]);

    if (result.length === 0) {
      throw new Error(`Catalog with ID ${catalogId} does not exist`);
    }

    // Proceed with deletion
    const sql = "DELETE FROM catalog WHERE id = ?";
    await db.query(sql, [catalogId]);
  } catch (err) {
    throw new Error(`Failed to delete catalog: ${err.message}`);
  }
};

const updateCatalog = async (catalogData, catalogId) => {
  try {
    const checkSql = "SELECT * FROM catalog WHERE id = ?";
    const [result] = await db.query(checkSql, [catalogId]);

    if (result.length === 0) {
      throw new Error(`Catalog with ID ${catalogId} does not exist`);
    }

    let sql = `UPDATE catalog SET ? WHERE id = ?`;
    await db.query(sql, [catalogData, catalogId]);
  } catch (err) {
    throw new Error(`Failed to update catalog: ${err.message}`);
  }
};

module.exports = {
  getCatalogs,
  getCatalogId,
  addCatalog,
  deleteCatalog,
  updateCatalog,
};

const db = require("../config/db");

const findByEmail = async (email) => {
  try {
    const sql = "SELECT * FROM user WHERE email = ?";
    const [result] = await db.query(sql, [email]);
    return result[0];
  } catch (err) {
    throw new Error(`Failed to find user by Email : ${err.message}`);
  }
};

const findPById = async (id) => {
  try {
    let sql = "SELECT * FROM user WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result[0];
  } catch (err) {
    throw new Error(`Failed to find user by Id : ${err.message}`);
  }
};

const updatePasswordId = async (userId, password) => {
  try {
    let sql = "UPDATE user SET password = ? WHERE id = ?";
    const [result] = await db.query(sql, [password, userId]);
    return result;
  } catch (err) {
    throw new Error(`Failed to update password: ${err.message}`);
  }
};

const createUser = async (userData) => {
  try {
    let sql = "INSERT INTO user SET ?";
    const [result] = await db.query(sql, userData);
    return result;
  } catch (err) {
    throw new Error(`Failed to create user : ${err.message}`);
  }
};

module.exports = {
  findByEmail,
  createUser,
  findPById,
  updatePasswordId,
};

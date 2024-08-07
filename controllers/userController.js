const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const PRIVATE_KEY = process.env.PRIVATE_KEY || fs.readFileSync("private-key.txt");
const maxAge = 3 * 60 * 60;

const userModel = require("../models/userModel");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, PRIVATE_KEY, { expiresIn: maxAge });

    // Thêm token vào header
    res.setHeader("Authorization", "Bearer " + token);
    res.json({
      message: "Login successful",
      token,
      expiresIn: maxAge,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

exports.register = async (req, res) => {
  const { email, password, fullName, role = 0, phone } = req.body;

  if (!email || !password || !fullName || !phone) {
    return res.status(400).json({ message: "All fields except role are required" });
  }

  try {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { email, password: hashedPassword, fullName, role, phone };

    const user = await userModel.createUser(newUser);

    let userId = user.insertId;
    const payload = { id: userId, fullName, email, role };

    // Tạo token JWT
    const token = jwt.sign(payload, PRIVATE_KEY, { expiresIn: maxAge });

    res.json({
      message: "User registered successfully",
      token,
      expiresIn: maxAge,
      user: { id: userId, email, fullName, role, phone },
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  let userId = req.params.id; // Lấy ID người dùng từ tham số URL

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old password and new password are required" });
  }

  try {
    const user = await userModel.findPById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const passwordChanged = await userModel.updatePasswordId(userId, hashedPassword);
    if (passwordChanged) {
      res.json({ message: "Password has been successfully changed" });
    } else {
      res.status(500).json({ message: "Error updating password" });
    }
  } catch {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

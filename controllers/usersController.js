import pool from "../config/db.js";
import bcrypt from "bcrypt";

// ------------------------- GET ALL USERS -------------------------
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role_id, is_active, last_login, created_at, updated_at
       FROM users ORDER BY id`
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------- GET USER BY ID -------------------------
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, email, role_id, is_active, last_login, created_at, updated_at
       FROM users WHERE id = ?`,
      [id]
    );

    if (!rows.length)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------- CREATE USER -------------------------
export const createUser = async (req, res) => {
  try {
    let { email, password, role_id, is_active } = req.body;

    // 1️⃣ Validate required inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & Password are required",
      });
    }

    // 2️⃣ Clean input
    email = email.trim().toLowerCase();
    password = password.trim();
    role_id = role_id ? Number(role_id) : null;
    is_active = is_active === undefined ? 1 : Number(is_active);

    // 3️⃣ Check if email exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Insert user
    const [result] = await pool.query(
      `INSERT INTO users (email, password_hash, role_id, is_active)
       VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, role_id, is_active]
    );

    // 6️⃣ Fetch newly created user
    const [newUser] = await pool.query(
      `SELECT id, email, role_id, is_active, created_at, updated_at
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser[0],
    });

  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------------- UPDATE USER -------------------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, role_id, is_active } = req.body;

    // Check existing user
    const [existing] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
    if (!existing.length)
      return res.status(404).json({ success: false, message: "User not found" });

    // Check if email belongs to another user
    if (email) {
      const [checkEmail] = await pool.query(
        `SELECT id FROM users WHERE email = ? AND id != ?`,
        [email, id]
      );
      if (checkEmail.length)
        return res.status(409).json({ success: false, message: "Email already in use" });
    }

    // Hash password if new password provided
    let hashedPassword = existing[0].password_hash;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    await pool.query(
      `UPDATE users 
       SET email = ?, password_hash = ?, role_id = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        email || existing[0].email,
        hashedPassword,
        role_id ?? existing[0].role_id,
        is_active ?? existing[0].is_active,
        id
      ]
    );

    // Return updated user
    const [updated] = await pool.query(
      `SELECT id, email, role_id, is_active, created_at, updated_at 
       FROM users WHERE id = ?`,
      [id]
    );

    res.json({ success: true, data: updated[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------- DELETE USER -------------------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

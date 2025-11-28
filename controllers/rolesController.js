// controllers/rolesController.js
import pool from "../config/db.js";

// helper: sanitize/validate simple
function validateRoleInput({ name, description }) {
  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("name is required and must be a non-empty string");
  } else if (name.length > 50) {
    errors.push("name max length is 50 chars");
  }
  if (description && description.length > 255) {
    errors.push("description max length is 255 chars");
  }
  return errors;
}

export const getAllRoles = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description, created_at, updated_at FROM roles ORDER BY id"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id, name, description, created_at, updated_at FROM roles WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const errors = validateRoleInput({ name, description });

    if (errors.length)
      return res.status(400).json({ success: false, errors });

    try {
      const [result] = await pool.query(
        "INSERT INTO roles (name, description) VALUES (?, ?)",
        [name.trim(), description || null]
      );

      const insertedId = result.insertId;

      const [rows] = await pool.query(
        "SELECT id, name, description, created_at, updated_at FROM roles WHERE id = ?",
        [insertedId]
      );

      res.status(201).json({ success: true, data: rows[0] });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "Role with this name already exists",
        });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const errors = validateRoleInput({
      name: name ?? "",
      description,
    });

    if (errors.length)
      return res.status(400).json({ success: false, errors });

    const [existing] = await pool.query(
      "SELECT id FROM roles WHERE id = ?",
      [id]
    );

    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });

    try {
      await pool.query(
        "UPDATE roles SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [name.trim(), description || null, id]
      );
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "Role name already in use by another role",
        });
      }
      throw err;
    }

    const [rows] = await pool.query(
      "SELECT id, name, description, created_at, updated_at FROM roles WHERE id = ?",
      [id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM roles WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });

    res.json({ success: true, message: "Role deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import db from "../config/db.js";

// ---------------------------
// 🟢 GET all departments
// ---------------------------
export const getAllDepartments = async (req, res) => {
  const sql = "SELECT * FROM departments ORDER BY id DESC";

  try {
    const [rows] = await db.query(sql); // ✅ no callback
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------
// 🟢 GET department by ID
// ---------------------------
export const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM departments WHERE id = ?";

  try {
    const [rows] = await db.query(sql, [id]); // ✅ no callback

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------
// 🟢 CREATE department
// ---------------------------
export const createDepartment = async (req, res) => {
  const { name, type, code, description, status } = req.body;

  // Validate required fields
  if (!name || !code || !type) {
    return res.status(400).json({
      success: false,
      message: "name, type and code are required fields",
    });
  }

  const sql = `
    INSERT INTO departments (name, type, code, description, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [
      name,
      type,
      code,
      description || null,
      status ?? 1, // default status = 1 (active)
    ]);

    return res.json({
      success: true,
      message: "Department created successfully",
      departmentId: result.insertId,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};


// ---------------------------
// 🟢 UPDATE department
// ---------------------------
export const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, type, code, description, status } = req.body;

  // Validate required fields
  if (!name || !type || !code) {
    return res.status(400).json({
      success: false,
      message: "name, type and code are required fields",
    });
  }

  const sql = `
    UPDATE departments 
    SET 
      name = ?, 
      type = ?, 
      code = ?, 
      description = ?, 
      status = ?, 
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  try {
    const [result] = await db.query(sql, [
      name,
      type,
      code,
      description || null,
      status ?? 1,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.json({
      success: true,
      message: "Department updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------
// 🔴 DELETE department 
// ---------------------------
export const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Department ID is required",
    });
  }

  const sql = `DELETE FROM departments WHERE id = ?`;

  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};


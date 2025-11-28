import pool from "../config/db.js";

// ✅ Add New Medicine
export const addMedicine = async (req, res) => {
  try {
    const {
      brand_name,
      generic_name,
      strength,
      manufacturer,
      batch_no,
      quantity,
      status,
      notes,
      expiry_date   // ⭐ New field
    } = req.body;

    const sql = `
      INSERT INTO pharmacy_stock 
      (brand_name, generic_name, strength, manufacturer, batch_no, quantity, status, notes, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      brand_name,
      generic_name,
      strength,
      manufacturer,
      batch_no,
      quantity,
      status,
      notes,
      expiry_date
    ]);

    res.json({
      message: "Medicine added successfully",
      id: result.insertId,
    });

  } catch (err) {
    console.error("Add Medicine Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Medicines
export const getAllMedicines = async (req, res) => {
  try {
    const sql = "SELECT * FROM pharmacy_stock ORDER BY id DESC";

    const [data] = await pool.query(sql);

    res.json(data);
  } catch (err) {
    console.error("Get All Medicines Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Medicine By ID
export const getMedicineById = async (req, res) => {
  try {
    const sql = "SELECT * FROM pharmacy_stock WHERE id = ?";

    const [data] = await pool.query(sql, [req.params.id]);

    if (data.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(data[0]);
  } catch (err) {
    console.error("Get Medicine By ID Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Medicine
export const updateMedicine = async (req, res) => {
  try {
    const {
      brand_name,
      generic_name,
      strength,
      manufacturer,
      batch_no,
      quantity,
      status,
      notes,
      expiry_date   // ⭐ New field
    } = req.body;

    const sql = `
      UPDATE pharmacy_stock SET
        brand_name=?, generic_name=?, strength=?, manufacturer=?, 
        batch_no=?, quantity=?, status=?, notes=?, expiry_date=?
      WHERE id=?
    `;

    await pool.query(sql, [
      brand_name,
      generic_name,
      strength,
      manufacturer,
      batch_no,
      quantity,
      status,
      notes,
      expiry_date,
      req.params.id,
    ]);

    res.json({ message: "Record updated successfully" });
  } catch (err) {
    console.error("Update Medicine Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Medicine
export const deleteMedicine = async (req, res) => {
  try {
    const sql = "DELETE FROM pharmacy_stock WHERE id = ?";

    await pool.query(sql, [req.params.id]);

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Delete Medicine Error:", err);
    res.status(500).json({ error: err.message });
  }
};

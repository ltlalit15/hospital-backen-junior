import bcrypt from "bcrypt";
import pool from "../config/db.js"
// =========================================
// 📌 Helper: Validate Patient Input
// =========================================

// =========================================
// 1️⃣ CREATE PATIENT
// =========================================
export const createPatient = async (req, res) => {
  let conn;

  try {
    const {
      email,
      password,
      is_active = 1,
      first_name,
      last_name,
      gender,
      dob,
      phone,
      address,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
      insurance_provider,
      insurance_number,
      allergies,
      age,
      status,
      height_cm,
      weight_kg,
      medical_history,
      current_treatment
    } = req.body || {};

    // Basic validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Check if email exists
    const [check] = await conn.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (check.length > 0) {
      await conn.rollback();
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users with default PATIENT role_id = 5
    const [userResult] = await conn.query(
      `INSERT INTO users (email, password_hash, role_id, is_active) 
       VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, 5, is_active] // role_id = 5 for PATIENT
    );

    const user_id = userResult.insertId;

    // Insert into patients
    await conn.query(
      `INSERT INTO patients 
      (id, first_name, last_name, gender, dob, phone, email, address, blood_group,
       emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_number,
       allergies, created_at, updated_at, age, status, height_cm, weight_kg,
       medical_history, current_treatment)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        user_id,
        first_name,
        last_name,
        gender || null,
        dob || null,
        phone || null,
        email,
        address || null,
        blood_group || null,
        emergency_contact_name || null,
        emergency_contact_phone || null,
        insurance_provider || null,
        insurance_number || null,
        allergies || null,
        new Date(), // created_at
        new Date(), // updated_at
        age || null,
        status || 1,
        height_cm || null,
        weight_kg || null,
        medical_history || null,
        current_treatment || null
      ]
    );

    await conn.commit();
    res.status(201).json({ success: true, message: "Patient created successfully", user_id });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("❌ Create Patient Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

// =========================================
// 2️⃣ GET ALL PATIENTS
// =========================================
export const getAllPatients = async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.gender,
        p.dob,
        p.phone,
        p.email,
        p.address,
        p.blood_group,
        p.emergency_contact_name,
        p.emergency_contact_phone,
        p.insurance_provider,
        p.insurance_number,
        p.allergies,
        p.age,
        p.status,
        p.height_cm,
        p.weight_kg,
        p.medical_history,
        p.current_treatment,
        p.created_at,
        p.updated_at,
        u.role_id,
        u.is_active
      FROM patients p
      LEFT JOIN users u ON p.id = u.id
      ORDER BY p.created_at DESC
    `;

    const [patients] = await pool.query(sql);

    return res.status(200).json({
      success: true,
      total: patients.length,
      data: patients
    });

  } catch (err) {
    console.error("❌ Get All Patients Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};
// =========================================
// 3️⃣ GET SINGLE PATIENT
// =========================================
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const sql = `
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.gender,
        p.dob,
        p.phone,
        p.email,
        p.address,
        p.blood_group,
        p.emergency_contact_name,
        p.emergency_contact_phone,
        p.insurance_provider,
        p.insurance_number,
        p.allergies,
        p.age,
        p.status,
        p.height_cm,
        p.weight_kg,
        p.medical_history,
        p.current_treatment,
        p.created_at,
        p.updated_at,
        u.role_id,
        u.is_active
      FROM patients p
      LEFT JOIN users u ON p.id = u.id
      WHERE p.id = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });

  } catch (err) {
    console.error("❌ Get Patient By ID Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// =========================================
// 4️⃣ UPDATE PATIENT
// =========================================
export const updatePatient = async (req, res) => {
  let conn;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const {
      email,
      is_active,
      first_name,
      last_name,
      gender,
      dob,
      phone,
      address,
      blood_group,
      emergency_contact_name,
      emergency_contact_phone,
      insurance_provider,
      insurance_number,
      allergies,
      age,
      status,
      height_cm,
      weight_kg,
      medical_history,
      current_treatment
    } = req.body;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Check if patient exists
    const [existing] = await conn.query(
      `SELECT id FROM patients WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Update users table (only email & is_active)
    await conn.query(
      `
        UPDATE users
        SET 
          email = COALESCE(?, email),
          is_active = COALESCE(?, is_active)
        WHERE id = ?
      `,
      [email, is_active, id]
    );

    // Update patients table
    await conn.query(
      `
        UPDATE patients
        SET 
          first_name = COALESCE(?, first_name),
          last_name = COALESCE(?, last_name),
          gender = COALESCE(?, gender),
          dob = COALESCE(?, dob),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          blood_group = COALESCE(?, blood_group),
          emergency_contact_name = COALESCE(?, emergency_contact_name),
          emergency_contact_phone = COALESCE(?, emergency_contact_phone),
          insurance_provider = COALESCE(?, insurance_provider),
          insurance_number = COALESCE(?, insurance_number),
          allergies = COALESCE(?, allergies),
          age = COALESCE(?, age),
          status = COALESCE(?, status),
          height_cm = COALESCE(?, height_cm),
          weight_kg = COALESCE(?, weight_kg),
          medical_history = COALESCE(?, medical_history),
          current_treatment = COALESCE(?, current_treatment),
          updated_at = NOW()
        WHERE id = ?
      `,
      [
        first_name,
        last_name,
        gender,
        dob,
        phone,
        address,
        blood_group,
        emergency_contact_name,
        emergency_contact_phone,
        insurance_provider,
        insurance_number,
        allergies,
        age,
        status,
        height_cm,
        weight_kg,
        medical_history,
        current_treatment,
        id
      ]
    );

    await conn.commit();

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("❌ Update Patient Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  } finally {
    if (conn) conn.release();
  }
};
// =========================================
// 5️⃣ DELETE PATIENT                                                              
// =========================================
export const deletePatient = async (req, res) => {
  let conn;

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Check if patient exists
    const [check] = await conn.query(
      `SELECT id FROM patients WHERE id = ?`,
      [id]
    );

    if (check.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // First delete from patients table
    await conn.query(`DELETE FROM patients WHERE id = ?`, [id]);

    // Then delete from users table
    await conn.query(`DELETE FROM users WHERE id = ?`, [id]);

    await conn.commit();

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully"
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("❌ Delete Patient Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  } finally {
    if (conn) conn.release();
  }
};


import db from "../config/db.js";

// Generate unique appointment code
const generateAppointmentCode = () =>
  "APT-" + Math.floor(100000 + Math.random() * 900000);

// CREATE Appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      status,
      scheduled_at,
      duration_minutes,
      reason,
      notes,
      created_by,
    } = req.body;
     
    console.log(req.body);

    if (!patient_id || !doctor_id || !scheduled_at) {
      return res.status(400).json({
        success: false,
        message: "patient_id, doctor_id and scheduled_at are required",
      });
    }

    const appointment_code = generateAppointmentCode();

    const sql = `
      INSERT INTO appointments 
      (appointment_code, patient_id, doctor_id, status, scheduled_at, duration_minutes, reason, notes, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      appointment_code,
      patient_id,
      doctor_id,
      status || "scheduled",
      scheduled_at,
      duration_minutes || null,
      reason || null,
      notes || null,
      created_by || null,
    ]);

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment_id: result.insertId,
      appointment_code,
    });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET All Appointments
export const getAppointments = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.*, 
        p.first_name AS patient_first_name, 
        p.last_name AS patient_last_name,
        e.first_name AS doctor_first_name,
        e.last_name AS doctor_last_name
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      LEFT JOIN employees e ON e.id = a.doctor_id
      ORDER BY a.id DESC
    `;

    const [rows] = await db.query(sql);

    return res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET Appointment By ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT * FROM appointments WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Get Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE Appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      patient_id,
      doctor_id,
      status,
      scheduled_at,
      duration_minutes,
      reason,
      notes,
    } = req.body;

    const sql = `
      UPDATE appointments SET
      patient_id = ?, doctor_id = ?, status = ?, scheduled_at = ?, 
      duration_minutes = ?, reason = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      patient_id,
      doctor_id,
      status,
      scheduled_at,
      duration_minutes,
      reason,
      notes,
      id,
    ]);

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });

    return res.json({
      success: true,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("Update Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM appointments WHERE id = ?`;

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });

    return res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

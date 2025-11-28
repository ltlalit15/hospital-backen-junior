import db from "../config/db.js";


export const getPatientsByDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        message: "doctor_id is required",
      });
    }

    // Get all patients connected with this doctor
    const patientSql = `
      SELECT DISTINCT
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
        p.created_at,
        p.updated_at,
        p.age,
        p.height_cm,
        p.weight_kg,
        p.medical_history,
        p.current_treatment
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.doctor_id = ?
      ORDER BY p.id DESC
    `;

    const [patients] = await db.query(patientSql, [doctor_id]);

    return res.json({
      success: true,
      count: patients.length,
      data: patients,
    });

  } catch (error) {
    console.error("Get Patients by Doctor ID Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getAllDoctors = async (req, res) => {
  try {
    const [doctors] = await db.execute(`
      SELECT 
        e.id AS doctor_id,       -- ⭐ Doctor ID
        e.id AS employee_id,     -- (optional) Employee ID bhi bhej diya
        
        e.user_id,
        u.email,
        u.role_id,
        u.is_active AS user_active,

        e.first_name,
        e.last_name,
        e.phone,
        e.gender,
        e.dob,
        e.department_id,
        e.qualification,
        e.date_joined,
        e.is_active AS emp_active,
        e.address,
        e.specialization,
        e.experience,

        d.name AS department_name,
        d.type AS department_type,
        d.code AS department_code,

        r.name AS role_name
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN roles r ON u.role_id = r.id
      
      WHERE r.name = 'DOCTOR'

      ORDER BY e.id DESC
    `);

    res.json({
      success: true,
      total: doctors.length,
      doctors,
    });

  } catch (error) {
    console.error("Get Doctors Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        message: "doctor_id is required",
      });
    }

    // Fetch appointments by doctor_id
    const sql = `
      SELECT 
        a.*, 
        p.id AS patient_id,
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
        p.created_at AS patient_created_at,
        p.updated_at AS patient_updated_at,
        p.age,
        p.height_cm,
        p.weight_kg,
        p.medical_history,
        p.current_treatment
      FROM appointments a
      LEFT JOIN patients p ON p.id = a.patient_id
      WHERE a.doctor_id = ?
      ORDER BY a.id DESC
    `;

    const [rows] = await db.query(sql, [doctor_id]);

    return res.json({
      success: true,
      count: rows.length,
      data: rows,
    });

  } catch (error) {
    console.error("Get Appointments by Doctor ID Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        message: "doctor_id is required",
      });
    }

    const sql = `
      SELECT 
        d.*
      FROM doctors d
      WHERE d.id = ?
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [doctor_id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error("Get Doctor By ID Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDoctorsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: "patient_id required hai",
      });
    }

    const doctorSql = `
      SELECT DISTINCT
        e.id AS doctor_id,
        e.first_name,
        e.last_name,
        e.department_id,
        e.email,
        e.phone,
        e.created_at,
        e.updated_at
      FROM appointments a
      LEFT JOIN employees e ON e.id = a.doctor_id
      WHERE a.patient_id = ?
      ORDER BY e.id DESC
    `;

    const [doctors] = await db.query(doctorSql, [patient_id]);

    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Is patient_id ke liye koi doctor nahi mila",
      });
    }

    return res.json({
      success: true,
      count: doctors.length,
      data: doctors,
    });

  } catch (error) {
    console.error("Get Doctors by Patient ID Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAppointmentsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: "patient_id is required",
      });
    }

    // Fetch appointments by patient_id
    const sql = `
      SELECT 
        a.*, 
        d.id AS doctor_id,
        d.first_name AS doctor_first_name,
        d.last_name AS doctor_last_name,
        d.phone AS doctor_phone,
        d.email AS doctor_email,
        d.gender AS doctor_gender
      FROM appointments a
      LEFT JOIN employees d ON d.id = a.doctor_id
      WHERE a.patient_id = ?
      ORDER BY a.id DESC
    `;

    const [rows] = await db.query(sql, [patient_id]);

    return res.json({
      success: true,
      count: rows.length,
      data: rows,
    });

  } catch (error) {
    console.error("Get Appointments by Patient ID Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

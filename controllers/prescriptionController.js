import db from "../config/db.js";

export const createPrescription = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { patient_id, doctor_id, notes, items } = req.body;

    // Validate required fields
    if (!patient_id || !doctor_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patient_id, doctor_id and at least 1 item are required"
      });
    }

    // Start transaction
    await conn.beginTransaction();

    // Insert Prescription
    const [prescriptionResult] = await conn.execute(
      `INSERT INTO prescriptions (patient_id, doctor_id, notes) VALUES (?, ?, ?)`,
      [patient_id, doctor_id, notes || null]
    );

    const prescriptionId = prescriptionResult.insertId;

    // SQL for inserting prescription items
    const itemSql = `
      INSERT INTO prescription_items 
      (prescription_id, medication_id, name, dose, days, quantity) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Insert each item in the items array
    for (let item of items) {
      const { medication_id, name, dose, days, quantity } = item;

      await conn.execute(itemSql, [
        prescriptionId,
        medication_id || null,
        name,
        dose,
        days,
        quantity
      ]);
    }

    // Commit the transaction
    await conn.commit();

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription_id: prescriptionId
    });

  } catch (error) {
    // Rollback on error
    await conn.rollback();
    console.log("Create Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error creating prescription",
      error: error.message
    });
  } finally {
    // Release DB connection
    conn.release();
  }
};

export const getAllPrescriptions = async (req, res) => {
  try {

    // ==============================
    // 1️⃣ Get All Prescriptions + Patient + Doctor
    // ==============================
    const sqlPrescriptions = `
      SELECT 
        p.*,

        pt.first_name AS patient_first_name,
        pt.last_name AS patient_last_name,

        e.first_name AS doctor_first_name,
        e.last_name AS doctor_last_name
      FROM prescriptions p
      LEFT JOIN patients pt ON pt.id = p.patient_id
      LEFT JOIN employees e ON e.id = p.doctor_id
      ORDER BY p.id DESC
    `;

    const [prescriptions] = await db.execute(sqlPrescriptions);


    // ==============================
    // 2️⃣ Get All Prescription Items + Medication Info
    // ==============================
    const sqlItems = `
      SELECT 
        pi.*,
        ps.brand_name AS medication_name,
        ps.generic_name,
        ps.strength
      FROM prescription_items pi
      LEFT JOIN pharmacy_stock ps ON ps.id = pi.medication_id
    `;

    const [items] = await db.execute(sqlItems);


    // ==============================
    // 3️⃣ Attach Items to Related Prescription
    // ==============================
    const finalData = prescriptions.map((p) => {
      const prescriptionItems = items.filter(
        (item) => item.prescription_id === p.id
      );

      return {
        ...p,
        items: prescriptionItems || []
      };
    });


    // ==============================
    // 4️⃣ Response
    // ==============================
    return res.status(200).json({
      success: true,
      data: finalData
    });

  } catch (error) {
    console.log("Get All Prescriptions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message
    });
  }
};

export const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        message: "doctor_id is required",
      });
    }

    // ==============================
    // 1️⃣ Get Prescriptions for specific Doctor + Patient info
    // ==============================
    const sqlPrescriptions = `
      SELECT 
        p.*,

        pt.first_name AS patient_first_name,
        pt.last_name AS patient_last_name,

        e.first_name AS doctor_first_name,
        e.last_name AS doctor_last_name
      FROM prescriptions p
      LEFT JOIN patients pt ON pt.id = p.patient_id
      LEFT JOIN employees e ON e.id = p.doctor_id
      WHERE p.doctor_id = ?
      ORDER BY p.id DESC
    `;

    const [prescriptions] = await db.execute(sqlPrescriptions, [doctor_id]);

    // ==============================
    // 2️⃣ Get Prescription Items + Medication Info
    // ==============================
    const sqlItems = `
      SELECT 
        pi.*,
        ps.brand_name AS medication_name,
        ps.generic_name,
        ps.strength
      FROM prescription_items pi
      LEFT JOIN pharmacy_stock ps ON ps.id = pi.medication_id
    `;

    const [items] = await db.execute(sqlItems);

    // ==============================
    // 3️⃣ Attach Items to Related Prescription
    // ==============================
    const finalData = prescriptions.map((p) => {
      const prescriptionItems = items.filter(
        (item) => item.prescription_id === p.id
      );

      return {
        ...p,
        items: prescriptionItems || [],
      };
    });

    // ==============================
    // 4️⃣ Response
    // ==============================
    return res.status(200).json({
      success: true,
      data: finalData,
    });

  } catch (error) {
    console.log("Get Prescriptions By Doctor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: "patient_id is required",
      });
    }

    // ==============================
    // 1️⃣ Get Prescriptions for specific Patient + Patient & Doctor info
    // ==============================
    const sqlPrescriptions = `
      SELECT 
        p.*,

        pt.first_name AS patient_first_name,
        pt.last_name AS patient_last_name,

        e.first_name AS doctor_first_name,
        e.last_name AS doctor_last_name
      FROM prescriptions p
      LEFT JOIN patients pt ON pt.id = p.patient_id
      LEFT JOIN employees e ON e.id = p.doctor_id
      WHERE p.patient_id = ?
      ORDER BY p.id DESC
    `;

    const [prescriptions] = await db.execute(sqlPrescriptions, [patient_id]);

    // ==============================
    // 2️⃣ Get Prescription Items + Medication Info
    // ==============================
    const sqlItems = `
      SELECT 
        pi.*,
        ps.brand_name AS medication_name,
        ps.generic_name,
        ps.strength
      FROM prescription_items pi
      LEFT JOIN pharmacy_stock ps ON ps.id = pi.medication_id
    `;

    const [items] = await db.execute(sqlItems);

    // ==============================
    // 3️⃣ Attach Items to Related Prescription
    // ==============================
    const finalData = prescriptions.map((p) => {
      const prescriptionItems = items.filter(
        (item) => item.prescription_id === p.id
      );

      return {
        ...p,
        items: prescriptionItems || [],
      };
    });

    // ==============================
    // 4️⃣ Response
    // ==============================
    return res.status(200).json({
      success: true,
      data: finalData,
    });

  } catch (error) {
    console.log("Get Prescriptions By Patient Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    // ==============================
    // GET PRESCRIPTION + PATIENT + DOCTOR (EMPLOYEES)
    // ==============================
    const [prescription] = await db.execute(
      `
      SELECT 
        p.*,

        -- Patient Details
        pt.first_name AS patient_first_name,
        pt.last_name AS patient_last_name,
        pt.gender AS patient_gender,
        pt.dob AS patient_dob,
        pt.phone AS patient_phone,

        -- Doctor (Employee) Details
        e.first_name AS doctor_first_name,
        e.last_name AS doctor_last_name,
        e.phone AS doctor_phone,
        e.gender AS doctor_gender,
        e.department_id

      FROM prescriptions p
      LEFT JOIN patients pt ON pt.id = p.patient_id
      LEFT JOIN employees e ON e.id = p.doctor_id
      WHERE p.id = ?
      `,
      [id]
    );

    if (prescription.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found"
      });
    }

    // ==============================
    // GET PRESCRIPTION ITEMS
    // ==============================
    const [items] = await db.execute(
      `SELECT * FROM prescription_items WHERE prescription_id = ?`,
      [id]
    );

    // ==============================
    // FINAL RESPONSE
    // ==============================
    return res.status(200).json({
      success: true,
      data: {
        ...prescription[0],
        items
      }
    });

  } catch (error) {
    console.log("Get Prescription by ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching prescription",
      error: error.message
    });
  }
};

export const deletePrescription = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { id } = req.params;

    await conn.beginTransaction();

    // Delete items first
    await conn.execute(
      `DELETE FROM prescription_items WHERE prescription_id = ?`,
      [id]
    );

    // Delete prescription
    const [result] = await conn.execute(
      `DELETE FROM prescriptions WHERE id = ?`,
      [id]
    );

    await conn.commit();

    return res.status(200).json({
      success: true,
      message: "Prescription deleted successfully"
    });

  } catch (error) {
    await conn.rollback();
    console.log("Delete Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting prescription",
      error: error.message
    });
  } finally {
    conn.release();
  }
};

export const updatePrescription = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { id } = req.params; // Prescription ID
    const { patient_id, doctor_id, notes, items } = req.body;

    // Validate required fields
    if (!patient_id || !doctor_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patient_id, doctor_id and at least 1 item are required"
      });
    }

    // Start transaction
    await conn.beginTransaction();

    // Update prescription
    await conn.execute(
      `UPDATE prescriptions SET patient_id = ?, doctor_id = ?, notes = ? WHERE id = ?`,
      [patient_id, doctor_id, notes || null, id]
    );

    // Delete existing prescription items
    await conn.execute(
      `DELETE FROM prescription_items WHERE prescription_id = ?`,
      [id]
    );

    // Insert new prescription items
    const itemSql = `
      INSERT INTO prescription_items 
      (prescription_id, medication_id, name, dose, days, quantity) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (let item of items) {
      const { medication_id, name, dose, days, quantity } = item;
      await conn.execute(itemSql, [
        id,
        medication_id || null,
        name,
        dose,
        days,
        quantity
      ]);
    }

    // Commit transaction
    await conn.commit();

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      prescription_id: id
    });

  } catch (error) {
    // Rollback on error
    await conn.rollback();
    console.log("Update Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating prescription",
      error: error.message
    });
  } finally {
    conn.release();
  }
};

import db from "../config/db.js";

// Create Test
export const createLabTest = async (req, res) => {
  try {
    const { name, price } = req.body;

    await db.execute(
      "INSERT INTO lab_tests (name, price) VALUES (?, ?)",
      [name, price]
    );

    res.json({ success: true, message: "Lab test created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all tests
export const getLabTests = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM lab_tests");
  res.json(rows);
};


export const createLabRequest = async (req, res) => {
  try {
    const { patient_id, test_id, requested_by } = req.body;

    await db.execute(
      `INSERT INTO lab_test_requests (patient_id, test_id, requested_by, status) 
       VALUES (?, ?, ?, 'Pending')`,
      [patient_id, test_id, requested_by]
    );

    res.json({ success: true, message: "Lab test request created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all requests
export const getLabRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        lr.*, 
        lt.name AS test_name, 
        lt.price,
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
        CONCAT(e.first_name, ' ', e.last_name) AS doctor_name
      FROM lab_test_requests lr
      LEFT JOIN lab_tests lt ON lt.id = lr.test_id
      LEFT JOIN patients p ON p.id = lr.patient_id
      LEFT JOIN employees e ON e.id = lr.requested_by
    `);

    res.json(rows);
  } catch (err) {
    console.error("Get Lab Requests Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getLabRequestsByDoctor = async (req, res) => {
  try {
    const { request_id } = req.params;
     console.log("Request ID:", request_id);
    if (!request_id) {
      return res.status(400).json({
        success: false,
        message: "request_id is required",
      });
    }

    const sql = `
      SELECT
        lr.id AS result_id,
        lr.request_id,
        lr.result_file,
        lr.notes,
        lr.created_at AS result_date,

        -- request table
        req.status AS request_status,
        req.created_at AS request_created_at,

        -- test info
        lt.name AS test_name,
        lt.price AS test_price,

        -- patient info
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name,

        -- doctor info (employees.user_id matches lab_test_requests.requested_by)
        CONCAT(e.first_name, ' ', e.last_name) AS doctor_name

      FROM lab_test_results lr
      INNER JOIN lab_test_requests req ON lr.request_id = req.id
      INNER JOIN lab_tests lt ON req.test_id = lt.id
      INNER JOIN patients p ON req.patient_id = p.id
      LEFT JOIN employees e ON e.user_id = req.requested_by

      WHERE lr.request_id = ?

      ORDER BY lr.created_at DESC
    `;

    const [rows] = await db.query(sql, [request_id]);

    return res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching lab results by request ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// export const getLabRequestsByDoctor = async (req, res) => {
//   try {
//     const { request_id } = req.params;

//     if (!request_id) {
//       return res.status(400).json({
//         success: false,
//         message: "doctor_id is required",
//       });
//     }

//     const [rows] = await db.query(
//       `
//       SELECT 
//         lr.*, 
//         lt.name AS test_name, 
//         lt.price,
//         CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
//         CONCAT(e.first_name, ' ', e.last_name) AS doctor_name
//       FROM lab_test_requests lr
//       LEFT JOIN lab_tests lt ON lt.id = lr.test_id
//       LEFT JOIN patients p ON p.id = lr.patient_id
//       LEFT JOIN employees e ON e.id = lr.requested_by
//       WHERE lr.requested_by = ?
//       ORDER BY lr.id DESC
//       `,
//       [request_id]
//     );

//     res.json({
//       success: true,
//       total: rows.length,
//       data: rows,
//     });
//   } catch (err) {
//     console.error("Get Lab Requests by Doctor Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

export const getLabRequestsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: "patient_id is required",
      });
    }

    const [rows] = await db.query(
      `
      SELECT 
        lr.*, 
        lt.name AS test_name, 
        lt.price,
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
        CONCAT(e.first_name, ' ', e.last_name) AS doctor_name
      FROM lab_test_requests lr
      LEFT JOIN lab_tests lt ON lt.id = lr.test_id
      LEFT JOIN patients p ON p.id = lr.patient_id
      LEFT JOIN employees e ON e.id = lr.requested_by
      WHERE lr.patient_id = ?
      ORDER BY lr.id DESC
      `,
      [patient_id]
    );

    res.json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("Get Lab Requests by Patient Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single request
export const getLabRequestById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM lab_test_requests WHERE id=?", [id]);
  res.json(rows[0]);
};

// Update status (Pending → Completed)
export const updateLabRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Pending / Completed

  await db.execute(
    "UPDATE lab_test_requests SET status=? WHERE id=?",
    [status, id]
  );

  res.json({ success: true, message: "Status updated" });
};


export const uploadLabResult = async (req, res) => {
  try {
    const { request_id, notes } = req.body;
    if (!request_id) {
      return res.status(400).json({ success: false, message: "request_id is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Result file is required" });
    }

    const result_file = req.file.path; // path saved by multer

    const [result] = await db.execute(
      "INSERT INTO lab_test_results (request_id, result_file, notes) VALUES (?, ?, ?)",
      [request_id, result_file, notes || null]
    );

    res.status(201).json({ success: true, message: "Lab result uploaded", data: { id: result.insertId, request_id, result_file, notes } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Result by Request ID
export const getLabResult = async (req, res) => {
  const { request_id } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM lab_test_results WHERE request_id=?",
    [request_id]
  );

  res.json(rows[0] || {});
};


// Update Lab Test
export const updateLabRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, test_id, requested_by, status } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "id is required" });
    }

    await db.execute(
      `UPDATE lab_test_requests 
       SET patient_id = ?, test_id = ?, requested_by = ?, status = ?
       WHERE id = ?`,
      [patient_id, test_id, requested_by, status, id]
    );

    res.json({ success: true, message: "Lab test request updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete Lab Test
export const deleteLabRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "id is required" });
    }

    await db.execute(`DELETE FROM lab_test_requests WHERE id = ?`, [id]);

    res.json({ success: true, message: "Lab test request deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getLabResultsByPatientId = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: "patient_id is required",
      });
    }

    const sql = `
      SELECT 
        lr.id AS result_id,
        lr.result_file,
        lr.notes,
        lr.created_at AS result_date,

        req.id AS request_id,
        req.status,
        req.created_at AS request_date,

        lt.name AS test_name,
        lt.price,

        CONCAT(p.first_name, ' ', p.last_name) AS patient_name
      FROM lab_test_results lr
      INNER JOIN lab_test_requests req ON lr.request_id = req.id
      INNER JOIN lab_tests lt ON req.test_id = lt.id
      INNER JOIN patients p ON req.patient_id = p.id
      WHERE req.patient_id = ?
      ORDER BY lr.created_at DESC
    `;

    const [rows] = await db.execute(sql, [patient_id]);

    res.json({
      success: true,
      message: "Lab test results fetched successfully",
      data: rows
    });
  } catch (err) {
    console.error("Error Fetching Lab Results:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getLabResultsByDoctorId = async (req, res) => {
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
        lr.id AS result_id,
        lr.result_file,
        lr.notes,
        lr.created_at AS result_date,

        req.id AS request_id,
        req.status,
        req.created_at AS request_date,

        lt.name AS test_name,
        lt.price,

        CONCAT(p.first_name, ' ', p.last_name) AS patient_name
      FROM lab_test_results lr
      INNER JOIN lab_test_requests req ON lr.request_id = req.id
      INNER JOIN lab_tests lt ON req.test_id = lt.id
      INNER JOIN patients p ON req.patient_id = p.id
      WHERE req.doctor_id = ?
      ORDER BY lr.created_at DESC
    `;

    const [rows] = await db.execute(sql, [doctor_id]);

    res.json({
      success: true,
      message: "Lab test results fetched successfully for doctor",
      data: rows
    });
  } catch (err) {
    console.error("Error Fetching Lab Results:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



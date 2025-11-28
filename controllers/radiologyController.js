import db from "../config/db.js";

// 1. Create test
export const createRadiologyTest = async (req, res) => {
try {
const { name, price } = req.body;
await db.execute("INSERT INTO radiology_tests (name, price) VALUES (?, ?)", [name, price]);
res.json({ success: true, message: "Test created" });
} catch (err) {
res.status(500).json({ success: false, error: err.message });
}
};


export const getRadiologyResultsByRequestId = async (req, res) => {
  try {
    const { request_id } = req.params;

    if (!request_id) {
      return res.status(400).json({
        success: false,
        message: "request_id is required",
      });
    }

    const sql = `
      SELECT
        rr.id AS result_id,
        rr.request_id,
        rr.result_file,
        rr.notes,
        rr.created_at AS result_date,

        -- request info
        req.status AS request_status,
        req.created_at AS request_created_at,

        -- test info
        rt.name AS test_name,
        rt.price AS test_price,

        -- patient info
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name,

        -- doctor info (employees.user_id = req.requested_by)
        CONCAT(e.first_name, ' ', e.last_name) AS doctor_name

      FROM radiology_test_results rr
      INNER JOIN radiology_test_requests req ON rr.request_id = req.id
      INNER JOIN radiology_tests rt ON req.test_id = rt.id
      INNER JOIN patients p ON req.patient_id = p.id
      LEFT JOIN employees e ON e.user_id = req.requested_by

      WHERE rr.request_id = ?

      ORDER BY rr.created_at DESC
    `;

    const [rows] = await db.query(sql, [request_id]);

    return res.json({
      success: true,
      total: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Error fetching radiology results:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// Get tests
export const getRadiologyTests = async (req, res) => {
const [rows] = await db.execute("SELECT * FROM radiology_tests");
res.json(rows);
};

// 2. Create request
export const createRadiologyRequest = async (req, res) => {
try {
const { patient_id, doctor_id, test_id } = req.body;
await db.execute(
"INSERT INTO radiology_requests (patient_id, doctor_id, test_id, status, requested_at) VALUES (?, ?, ?, 'Pending', NOW())",
[patient_id, doctor_id, test_id]
);


res.json({ success: true, message: "Request created" });
} catch (err) {
res.status(500).json({ success: false, error: err.message });
}
};

// Get all requests
export const getRadiologyRequests = async (req, res) => {
  const [rows] = await db.execute(`
    SELECT 
      r.*, 
      CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
      CONCAT(e.first_name, ' ', e.last_name) AS doctor_name, 
      t.name AS test_name
    FROM radiology_requests r
    LEFT JOIN patients p ON p.id = r.patient_id
    LEFT JOIN employees e ON e.id = r.doctor_id
    LEFT JOIN radiology_tests t ON t.id = r.test_id
  `);

  res.json(rows);
};

export const getRadiologyRequestsByDoctor = async (req, res) => {
  try {
  const {request_id } = req.params;
  console.log("Request ID:", request_id);

    if (!request_id) {
      return res.status(400).json({
        success: false,
        message: "doctor_id is required",
      });
    }

    const [rows] = await db.execute(
      `
      SELECT 
        r.*, 
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
        CONCAT(e.first_name, ' ', e.last_name) AS doctor_name, 
        t.name AS test_name
      FROM radiology_requests r
      LEFT JOIN patients p ON p.id = r.patient_id
      LEFT JOIN employees e ON e.id = r.doctor_id
      LEFT JOIN radiology_tests t ON t.id = r.test_id
      WHERE r.doctor_id = ?
      ORDER BY r.id DESC
      `,
      [request_id]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getRadiologyRequestsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: "patient_id is required",
      });
    }

    const [rows] = await db.execute(
      `
      SELECT 
        r.*, 
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name, 
        CONCAT(e.first_name, ' ', e.last_name) AS doctor_name, 
        t.name AS test_name
      FROM radiology_requests r
      LEFT JOIN patients p ON p.id = r.patient_id
      LEFT JOIN employees e ON e.id = r.doctor_id
      LEFT JOIN radiology_tests t ON t.id = r.test_id
      WHERE r.patient_id = ?
      ORDER BY r.id DESC
      `,
      [patient_id]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getRadiologyResultsByPatient = async (req, res) => {
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
        rr.*, 
        r.patient_id,
        r.doctor_id,
        r.test_id,
        r.status AS request_status,
        rt.name AS test_name,
        rt.price AS test_price,
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
        CONCAT(e.first_name, ' ', e.last_name) AS doctor_name
      FROM radiology_results rr
      LEFT JOIN radiology_requests r ON rr.request_id = r.id
      LEFT JOIN radiology_tests rt ON r.test_id = rt.id
      LEFT JOIN patients p ON r.patient_id = p.id
      LEFT JOIN employees e ON r.doctor_id = e.id
      WHERE r.patient_id = ?
      ORDER BY rr.performed_at DESC
    `;

    const [rows] = await db.query(sql, [patient_id]);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get Radiology Results Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get request by ID
export const getRadiologyRequestById = async (req, res) => {
const { id } = req.params;
const [rows] = await db.execute("SELECT * FROM radiology_requests WHERE id = ?", [id]);
res.json(rows[0]);
};

// 3. Upload result
export const uploadRadiologyResult = async (req, res) => {
  try {
    const { request_id, result_file, notes } = req.body;

    if (!request_id) {
      return res.status(400).json({
        success: false,
        message: "request_id required"
      });
    }

    await db.execute(
      "INSERT INTO radiology_results (request_id, result_file, notes, performed_at) VALUES (?, ?, ?, NOW())",
      [request_id, result_file, notes]
    );

    await db.execute(
      "UPDATE radiology_requests SET status = 'Completed' WHERE id = ?",
      [request_id]
    );

    res.json({ success: true, message: "Result uploaded" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get result
export const getRadiologyResult = async (req, res) => {
const { request_id } = req.params;
const [rows] = await db.execute("SELECT * FROM radiology_results WHERE request_id = ?", [request_id]);
res.json(rows[0]);
};

export const updateRadiologyRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, doctor_id, test_id, status } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Request ID is required" });
    }

    const [result] = await db.execute(
      "UPDATE radiology_requests SET patient_id = ?, doctor_id = ?, test_id = ?, status = ? WHERE id = ?",
      [patient_id, doctor_id, test_id, status || 'Pending', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Request updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteRadiologyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Request ID is required" });
    }

    const [result] = await db.execute(
      "DELETE FROM radiology_requests WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

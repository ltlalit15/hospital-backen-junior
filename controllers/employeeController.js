import db from "../config/db.js";
import bcrypt from "bcrypt";

// ==============================================
// CREATE EMPLOYEE + USER
// ==============================================
export const createEmployee = async (req, res) => {
  try {
    const {
      email,
      password,
      role_id,
      first_name,
      last_name,
      phone,
      gender,
      dob,
      department_id,
      qualification,
      date_joined,
      is_active,
      address,
      specialization,
      experience,
    } = req.body;

    console.log("REQ.BODY:", req.body);

    // -----------------------
    // 1️⃣ Basic validation
    if (!email || !password || !role_id || !first_name || !department_id) {
      return res.status(400).json({
        success: false,
        message: "email, password, role_id, first_name & department_id are required",
      });
    }

    // -----------------------
    // 2️⃣ Check if user exists
    const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // -----------------------
    // 3️⃣ Insert into users table
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await db.execute(
      "INSERT INTO users (email, password_hash, role_id, is_active) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, role_id, is_active ?? 1]
    );

    const user_id = userResult.insertId;

    // -----------------------
    // 4️⃣ Insert into employees table
    await db.execute(
      `INSERT INTO employees (
        user_id, first_name, last_name, email, phone, gender, dob,
        department_id, qualification, date_joined, is_active, address, specialization, experience
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        first_name,
        last_name,
        email,
        phone,
        gender,
        dob,
        department_id,
        qualification,
        date_joined,
        is_active ?? 1,
        address,
        specialization,
        experience,
      ]
    );

    // -----------------------
    // 5️⃣ Success Response
    res.json({
      success: true,
      message: "Employee created successfully",
      user_id,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

  export const getAllEmployees = async (req, res) => {
    try {
      const [employees] = await db.execute(`
        SELECT 
          e.id AS employee_id,
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
          d.code AS department_code
        FROM employees e
        LEFT JOIN users u ON e.user_id = u.id
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY e.id DESC
      `);

      res.json({
        success: true,
        total: employees.length,
        employees,
      });

    } catch (error) {
      console.error("Get Employees Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT e.*, u.role_id, r.name AS role_name, d.name AS department_name
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = ?
    `;

    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: "DB error", err });
      if (result.length === 0) return res.status(404).json({ success: false, message: "Employee not found" });

      res.json({ success: true, data: result[0] });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params; // employee id

    const {
      email,
      role_id,
      is_active,
      first_name,
      last_name,
      phone,
      gender,
      dob,
      department_id,
      qualification,
      date_joined,
      address,
      specialization,
      experience
    } = req.body;

    // -------------------------
    // 1️⃣ Check employee exists
    const [employee] = await db.execute(
      "SELECT * FROM employees WHERE id = ?",
      [id]
    );

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const user_id = employee[0].user_id;

    // -------------------------
    // 2️⃣ Update users table
    await db.execute(
      `
      UPDATE users 
      SET email = ?, role_id = ?, is_active = ?
      WHERE id = ?
      `,
      [email, role_id, is_active, user_id]
    );

    // -------------------------
    // 3️⃣ Update employees table
    await db.execute(
      `
      UPDATE employees 
      SET 
        first_name = ?, 
        last_name = ?, 
        phone = ?, 
        gender = ?, 
        dob = ?, 
        department_id = ?, 
        qualification = ?, 
        date_joined = ?, 
        is_active = ?, 
        address = ?, 
        specialization = ?, 
        experience = ?
      WHERE id = ?
      `,
      [
        first_name,
        last_name,
        phone,
        gender,
        dob,
        department_id,
        qualification,
        date_joined,
        is_active,
        address,
        specialization,
        experience,
        id,
      ]
    );

    // -------------------------
    // 4️⃣ Success Response
    res.json({
      success: true,
      message: "Employee updated successfully",
    });

  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Check if employee exists
    const [employee] = await db.execute(
      "SELECT user_id FROM employees WHERE id = ?",
      [id]
    );

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const user_id = employee[0].user_id;

    // 2️⃣ Delete employee record permanently
    await db.execute("DELETE FROM employees WHERE id = ?", [id]);

    // 3️⃣ Delete user record also (optional but recommended)
    await db.execute("DELETE FROM users WHERE id = ?", [user_id]);

    // 4️⃣ Success response
    res.json({
      success: true,
      message: "Employee permanently deleted (hard delete)",
    });

  } catch (error) {
    console.error("Delete Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



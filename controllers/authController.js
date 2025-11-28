import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// export const login = async (req, res) => {
//   try {
//     let { email, password } = req.body;

//     email = email?.trim();
//     password = password?.trim();

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: "Email & Password are required" });
//     }

//     // Fetch user
//     const userSql = `
//       SELECT u.*, r.name AS role_name 
//       FROM users u
//       LEFT JOIN roles r ON u.role_id = r.id
//       WHERE u.email = ?
//     `;

//     const [rows] = await pool.query(userSql, [email]);
//     const user = rows[0];

//     if (!user) {
//       return res.status(404).json({ success: false, message: "Invalid email or password" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: "Invalid email or password" });
//     }

//     // Generate Token
//     const token = jwt.sign(
//       {
//         user_id: user.id,
//         role_id: user.role_id,
//         role_name: user.role_name,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Get employee profile
//     const empSql = `
//       SELECT e.*, d.name AS department_name
//       FROM employees e
//       LEFT JOIN departments d ON e.department_id = d.id
//       WHERE e.user_id = ?
//     `;

//     const [empRows] = await pool.query(empSql, [user.id]);
//     const employee = empRows[0] || null;

//     return res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         role_id: user.role_id,
//         role_name: user.role_name ? user.role_name.toUpperCase() : null
//       },
//       employee,
//     });
//   } catch (error) {
//     console.error("LOGIN ERROR:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & Password are required" });
    }

    // Fetch user
    const userSql = `
      SELECT u.*, r.name AS role_name 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `;

    const [rows] = await pool.query(userSql, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate Token
    const token = jwt.sign(
      {
        user_id: user.id,
        role_id: user.role_id,
        role_name: user.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Get employee profile
    const empSql = `
      SELECT e.*, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.user_id = ?
    `;

    const [empRows] = await pool.query(empSql, [user.id]);
    const employee = empRows[0] || null;

    // 🔥 RETURN UPDATED (Only this part changed)
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name ? user.role_name.toUpperCase() : null
      },
      employee,
      employee_id: employee ? employee.id : null   // ⭐ Added this line only
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


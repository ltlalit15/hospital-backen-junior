// import express from "express";
// import { loginUser } from "../controllers/authController.js";
// import { verifyToken } from "../middlewares/authMiddleware.js"; // ✅ JWT middleware import
// import { checkRole } from "../middlewares/checkRole.js";

// const router = express.Router();

// // 🧠 Public Route — login
// // POST /api/auth/login
// router.post("/login", loginUser);

// // 🔒 Protected Route — profile (only accessible with valid token)
// router.get("/profile", verifyToken, checkRole([""]),(req, res) => {
//   res.json({
//     message: "You are logged in successfully!",
//     user: req.user, // decoded token data (id, role, etc.)
//   });
// });

// export default router;






import express from "express";
import { loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

// Public route — login
router.post("/login", loginUser);

// Protected route — just to test token/role
router.get("/profile", verifyToken, checkRole(["admin", "doctor", "receptionist"]), (req, res) => {
  res.json({
    message: "You are logged in successfully!",
    user: req.user,
  });
});

export default router;

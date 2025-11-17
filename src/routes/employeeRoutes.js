

import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);

// 👨‍⚕️ Employee Management
router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.patch("/:id", updateEmployee);
router.put("/:id",updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;

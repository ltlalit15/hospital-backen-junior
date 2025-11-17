import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// 🏥 Department Routes
router.post("/", createDepartment);
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;

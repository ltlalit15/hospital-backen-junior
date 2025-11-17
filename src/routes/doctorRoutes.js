import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.post("/", createDoctor);
router.patch("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;

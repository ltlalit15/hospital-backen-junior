import express from "express";
import {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

import { getPatientCount } from "../controllers/patientController.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);
// 🧩 Define routes
router.post("/", registerPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.patch("/:id", updatePatient); // Partial update ✅
router.delete("/:id", deletePatient);

router.get("/count/total", getPatientCount);

export default router;

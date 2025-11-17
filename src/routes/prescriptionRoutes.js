import express from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);

router.post("/", createPrescription);
router.get("/", getAllPrescriptions);
router.get("/:id", getPrescriptionById);
router.put("/:id", updatePrescription);
router.delete("/:id", deletePrescription);

export default router;

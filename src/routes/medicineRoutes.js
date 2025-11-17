import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);
// ✅ Routes
router.post("/", createMedicine);
router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.patch("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;

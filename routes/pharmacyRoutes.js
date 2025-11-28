import express from "express";
import {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controllers/pharmacyController.js";

const router = express.Router();

router.post("/", addMedicine);

router.get("/", getAllMedicines);

router.get("/:id", getMedicineById);
 
router.put("/:id", updateMedicine);

router.delete("/:id", deleteMedicine);

export default router;
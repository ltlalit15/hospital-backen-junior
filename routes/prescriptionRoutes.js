import express from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  deletePrescription,
  updatePrescription,
  getPrescriptionsByDoctor,
  getPrescriptionsByPatient
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.post("/", createPrescription);
router.get("/", getAllPrescriptions);
router.get("/:id", getPrescriptionById);
router.get("/by-doctor/:doctor_id", getPrescriptionsByDoctor);
router.get("/by-patient/:patient_id", getPrescriptionsByPatient);
router.put("/:id", updatePrescription);
router.delete("/:id", deletePrescription);

export default router;

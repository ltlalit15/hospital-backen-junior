import express from "express";
import { getAllDoctors
, getPatientsByDoctor,
    getAppointmentsByDoctor,
    getDoctorById,
    getDoctorsByPatient
 } from "../controllers/doctorController.js";

const router = express.Router();

// 🩺 Get only doctors
router.get("/", getAllDoctors);
router.get("/patients/:doctor_id", getPatientsByDoctor);
router.get("/doctorsbypatient/:patient_id", getDoctorsByPatient);
router.get("/appointments/:doctor_id", getAppointmentsByDoctor);
router.get("/doctor/:doctor_id", getDoctorById);




export default router;

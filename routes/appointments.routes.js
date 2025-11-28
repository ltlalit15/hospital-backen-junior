import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointments.controller.js";
import { getAppointmentsByPatient } from "../controllers/doctorController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.get("/patient/:patient_id", getAppointmentsByPatient);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;

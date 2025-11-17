import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;

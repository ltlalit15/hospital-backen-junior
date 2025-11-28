import dotenv from "dotenv";

dotenv.config(); // VERY IMPORTANT

import express from "express";
import cors from "cors";
import morgan from "morgan";
import db from "./config/db.js";
import rolesRoutes from "./routes/rolesRoutes.js";
import departmentsRoutes from "./routes/departmentsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import employeeRoutes from "./routes/employeesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentsRoutes from "./routes/appointments.routes.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import radiologyRoutes from "./routes/radiologyRoutes.js";


const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/radiology", radiologyRoutes);

// Test API
app.get("/", (req, res) => {
  res.send("HMS Backend Running");
});

export default app;

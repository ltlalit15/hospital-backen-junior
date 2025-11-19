// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import authRoutes from "./routes/authRoutes.js";
// import patientRoutes from "./routes/patientRoutes.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/patients", patientRoutes);

// app.get("/", (req, res) => {
//   res.send("Hospital Management Backend Running 🚀");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import radiologyRoutes from "./routes/radiologyRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js"; // ✅ correct
import employeeRoutes from "./routes/employeeRoutes.js";
import staffattendaceRoutes from "./routes/staffattendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import locationtrackerRoutes from "./routes/locationtrackerRoutes.js";
import beaconRoutes from "./routes/beaconRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/radiology", radiologyRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/staffattendance", staffattendaceRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/locationtracker",locationtrackerRoutes);
app.use("/api/beacon",beaconRoutes);

app.get("/", (req, res) => {
  res.send("Hospital Management System Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import  { upload }  from "../multer.js";
import {
  createLabTest,
  getLabTests, 
    createLabRequest,
    getLabRequests,
    getLabRequestById,
    updateLabRequestStatus,
    uploadLabResult,
    getLabResult,
    updateLabRequest,
    deleteLabRequest,
    getLabRequestsByDoctor,
    getLabRequestsByPatient,
    getLabResultsByPatientId,
    getLabResultsByDoctorId
} from "../controllers/labTestsController.js";


const router = express.Router();

// Lab Tests
router.post("/lab-tests", createLabTest);
router.get("/lab-tests", getLabTests);

// Requests
router.post("/lab-requests", createLabRequest);
router.get("/lab-requests", getLabRequests);
router.get("/lab-requests/doctor/:doctor_id", getLabRequestsByDoctor);
router.get("/lab-requests/patient/:patient_id", getLabRequestsByPatient);
router.get("/lab-results/patient/:patient_id", getLabResultsByPatientId);
router.get("/lab-results/doctor/:request_id",getLabRequestsByDoctor);


router.get("/lab-requests/:id", getLabRequestById);
router.put("/lab-requests/:id/status", updateLabRequestStatus);

// Results (with multer)
router.post("/upload", upload.single("result_file"), uploadLabResult);
router.get("/lab-results/:request_id", getLabResult);


// Update an existing lab test
router.put("/lab-tests/:id", updateLabRequest);
// Delete a lab test
router.delete("/lab-tests/:id", deleteLabRequest);

export default router;
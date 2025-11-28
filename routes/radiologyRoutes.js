import express from "express";
import { upload } from "../multer.js";
import {
createRadiologyTest,
getRadiologyTests,
createRadiologyRequest,
getRadiologyRequests,
getRadiologyRequestById,
uploadRadiologyResult,
getRadiologyResult,
updateRadiologyRequest,
deleteRadiologyRequest,
getRadiologyRequestsByDoctor,
getRadiologyRequestsByPatient,
getRadiologyResultsByPatient
} from "../controllers/radiologyController.js";


const router = express.Router();


// Test Master
router.post("/tests", createRadiologyTest);
router.get("/tests", getRadiologyTests);


// Requests
router.post("/requests", createRadiologyRequest);
router.get("/requests", getRadiologyRequests);
router.get("/doctor/:doctor_id", getRadiologyRequestsByDoctor);
router.get("/patient/:patient_id", getRadiologyRequestsByPatient);
router.get("/results/patient/:patient_id", getRadiologyResultsByPatient);
router.get("/results/doctor/:request_id", getRadiologyRequestsByDoctor);


router.get("/requests/:id", getRadiologyRequestById);


// Results (with file upload)
router.post("/results/upload", uploadRadiologyResult);
router.get("/results/:request_id", getRadiologyResult);


router.put("/radiology-requests/:id", updateRadiologyRequest);
router.delete("/radiology-requests/:id", deleteRadiologyRequest);

export default router;
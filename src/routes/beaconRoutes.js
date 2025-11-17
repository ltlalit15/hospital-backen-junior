import express from "express";
import {
  createBeacon,
  getAllBeacons,
  getBeaconById,
  updateBeacon,
  deleteBeacon,
} from "../controllers/beaconController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createBeacon);         // Add new beacon
router.get("/", getAllBeacons);            // Get all beacons
router.get("/:id", getBeaconById);            // Get one beacon
router.put("/:id", updateBeacon);      // Update beacon
router.delete("/:id", deleteBeacon);   // Delete beacon

export default router;

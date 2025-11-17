import express from "express";
import {
  createRadiologyOrder,
  getAllRadiologyOrders,
  getRadiologyOrderById,
  updateRadiologyOrder,
  deleteRadiologyOrder,
} from "../controllers/radiologyController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);

router.post("/", createRadiologyOrder);
router.get("/", getAllRadiologyOrders);
router.get("/:id", getRadiologyOrderById);
router.put("/:id", updateRadiologyOrder);
router.delete("/:id", deleteRadiologyOrder);

export default router;

import express from "express";
import {
  createLabOrder,
  getAllLabOrders,
  getLabOrderById,
  updateLabOrder,
  deleteLabOrder,
} from "../controllers/labController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);

router.post("/", createLabOrder);
router.get("/", getAllLabOrders);
router.get("/:id", getLabOrderById);
router.put("/:id", updateLabOrder);
router.delete("/:id", deleteLabOrder);

export default router;

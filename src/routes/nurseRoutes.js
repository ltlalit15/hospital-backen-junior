import express from "express";
import {
  getAllNurses,
  getNurseById,
  updateNurse,
  deleteNurse,
} from "../controllers/nurseController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// protected
router.use(verifyToken);

router.get("/", getAllNurses);
router.get("/:id", getNurseById);
router.put("/:id", updateNurse);
router.delete("/:id", deleteNurse);

export default router;

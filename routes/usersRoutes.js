import express from "express";
import { validateUser } from "../middlewares/validateUser.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

// APPLY VALIDATION ONLY FOR CREATE & UPDATE
router.post("/", validateUser, createUser);
router.put("/:id", validateUser, updateUser);

router.delete("/:id", deleteUser);

export default router;

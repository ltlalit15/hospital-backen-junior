import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";


import { getPendingPayments } from "../controllers/invoiceController.js";
import { getTodayRevenue } from "../controllers/invoiceController.js";





const router = express.Router();

// 🔒 Protect all routes
router.use(verifyToken);

router.post("/", createInvoice);
router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.patch("/:id", updateInvoice); // ✅ PATCH used for partial updates
router.delete("/:id", deleteInvoice);


router.get("/payments/pending", getPendingPayments);
router.get("/revenue/today", getTodayRevenue);

export default router;

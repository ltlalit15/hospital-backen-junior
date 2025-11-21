// import prisma from "../config/prismaClient.js";


// /**
//  * 🧾 Create a new Invoice
//  */
// export const createInvoice = async (req, res) => {
//   try {
//     const {
//       invoiceNumber,
//       invoiceType,
//       appointmentId,
//       admissionId,
//       pharmacySaleId,
//       labRequestId,
//       radiologyRequestId,
//       procedureId,
//       patientId,
//       totalAmount,
//       paidAmount,
//       paymentMode,
//       paymentStatus,
//       issuedAt,
//       dueAt,
//     } = req.body;

//     const invoice = await prisma.invoice.create({
//       data: {
//         invoiceNumber,
//         invoiceType,
//         appointmentId,
//         admissionId,
//         pharmacySaleId,
//         labRequestId,
//         radiologyRequestId,
//         procedureId,
//         patientId,
//         totalAmount,
//         paidAmount,
//         paymentMode,
//         paymentStatus,
//         issuedAt: issuedAt ? new Date(issuedAt) : undefined,
//         dueAt: dueAt ? new Date(dueAt) : undefined,
//       },
//       include: {
//         patient: true,
//       },
//     });

//     res.status(201).json({
//       message: "Invoice created successfully",
//       data: invoice,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Failed to create invoice",
//       error: error.message,
//     });
//   }
// };

// /**
//  * 📋 Get all invoices
//  */
// export const getAllInvoices = async (req, res) => {
//   try {
//     const invoices = await prisma.invoice.findMany({
//       where: { isActive: true },
//       include: { patient: true },
//       orderBy: { createdAt: "desc" },
//     });

//     res.json(invoices);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch invoices", error: error.message });
//   }
// };

// /**
//  * 🔍 Get invoice by ID
//  */
// export const getInvoiceById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const invoice = await prisma.invoice.findUnique({
//       where: { id: Number(id) },
//       include: { patient: true },
//     });

//     if (!invoice) return res.status(404).json({ message: "Invoice not found" });
//     res.json(invoice);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch invoice", error: error.message });
//   }
// };

// /**
//  * ✏️ Update an invoice (PATCH)
//  */
// export const updateInvoice = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await prisma.invoice.update({
//       where: { id: Number(id) },
//       data: req.body,
//     });
//     res.json({ message: "Invoice updated successfully", data: updated });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update invoice", error: error.message });
//   }
// };

// /**
//  * ❌ Delete (soft delete) an invoice
//  */
// export const deleteInvoice = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await prisma.invoice.update({
//       where: { id: Number(id) },
//       data: { isActive: false, deletedAt: new Date() },
//     });
//     res.json({ message: "Invoice deleted successfully", data: deleted });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete invoice", error: error.message });
//   }
// };






import prisma from "../config/prismaClient.js";

/**
 * 🧾 Create a new Invoice
 */
export const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceType,
      appointmentId,
      admissionId,
      pharmacySaleId,
      labRequestId,
      radiologyRequestId,
      procedureId,
      patientId,
      totalAmount,
      paidAmount,
      paymentMode,
      paymentStatus,
      issuedAt,
      dueAt,
    } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        invoiceType,
        appointmentId,
        admissionId,
        pharmacySaleId,
        labRequestId,
        radiologyRequestId,
        procedureId,
        patientId,
        totalAmount,
        paidAmount,
        paymentMode,
        paymentStatus,
        issuedAt: issuedAt ? new Date(issuedAt) : undefined,
        dueAt: dueAt ? new Date(dueAt) : undefined,
      },
      include: {
        patient: {
          include: {
            user: true, // ✅ so frontend gets patient's user details
          },
        },
      },
    });

    res.status(201).json({
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

/**
 * 📋 Get all invoices
 */
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { isActive: true },
      include: {
        patient: {
          include: {
            user: true, // ✅ include patient.user for name display
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch invoices", error: error.message });
  }
};

/**
 * 🔍 Get invoice by ID
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(id) },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

/**
 * ✏️ Update an invoice (PATCH)
 */
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.invoice.update({
      where: { id: Number(id) },
      data: req.body,
      include: {
        patient: {
          include: { user: true },
        },
      },
    });
    res.json({ message: "Invoice updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update invoice",
      error: error.message,
    });
  }
};

/**
 * ❌ Delete (soft delete) an invoice
 */
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.invoice.update({
      where: { id: Number(id) },
      data: { isActive: false, deletedAt: new Date() },
    });
    res.json({ message: "Invoice deleted successfully", data: deleted });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete invoice",
      error: error.message,
    });
  }
};




export const getPendingPayments = async (req, res) => {
  try {
    const pending = await prisma.invoice.findMany({
      where: { paymentStatus: "PENDING", isActive: true },
      include: { patient: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

export const getTodayRevenue = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0,0,0,0);

    const revenue = await prisma.invoice.aggregate({
      where: { issuedAt: { gte: start }, paymentStatus: "PAID" },
      _sum: { paidAmount: true }
    });

    res.json({ todayRevenue: revenue._sum.paidAmount || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 📌 Create new Lab Order
export const createLabOrder = async (req, res) => {
  try {
    const { patientName, testType, orderedBy, status } = req.body;

    if (!patientName || !testType || !orderedBy) {
      return res.status(400).json({ message: "All required fields are mandatory" });
    }

    const newOrder = await prisma.labOrder.create({
      data: {
        patientName,
        testType,
        orderedBy,
        status: status || "PENDING",
      },
    });

    res.status(201).json({
      message: "Lab order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating lab order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📋 Get all Lab Orders
export const getAllLabOrders = async (req, res) => {
  try {
    const orders = await prisma.labOrder.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching lab orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔍 Get Lab Order by ID
export const getLabOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.labOrder.findUnique({
      where: { id: Number(id) },
    });

    if (!order) {
      return res.status(404).json({ message: "Lab order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching lab order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✏️ Update Lab Order
export const updateLabOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientName, testType, orderedBy, status } = req.body;

    const updatedOrder = await prisma.labOrder.update({
      where: { id: Number(id) },
      data: {
        patientName,
        testType,
        orderedBy,
        status,
      },
    });

    res.json({
      message: "Lab order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating lab order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🗑️ Delete Lab Order
export const deleteLabOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.labOrder.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Lab order deleted successfully" });
  } catch (error) {
    console.error("Error deleting lab order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

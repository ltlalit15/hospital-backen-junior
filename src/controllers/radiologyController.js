import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 📌 Create a new Radiology Order
export const createRadiologyOrder = async (req, res) => {
  try {
    const { patientName, studyType, orderedBy, orderedDate, status } = req.body;

    if (!patientName || !studyType || !orderedBy || !orderedDate) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newOrder = await prisma.radiologyOrder.create({
      data: {
        patientName,
        studyType,
        orderedBy,
        orderedDate: new Date(orderedDate),
        status: status || "PENDING",
      },
    });

    return res.status(201).json({
      message: "Radiology order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating radiology order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📋 Get all Radiology Orders
export const getAllRadiologyOrders = async (req, res) => {
  try {
    const orders = await prisma.radiologyOrder.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching radiology orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔍 Get Radiology Order by ID
export const getRadiologyOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.radiologyOrder.findUnique({
      where: { id: Number(id) },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✏️ Update Radiology Order
export const updateRadiologyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientName, studyType, orderedBy, orderedDate, status } = req.body;

    const updatedOrder = await prisma.radiologyOrder.update({
      where: { id: Number(id) },
      data: {
        patientName,
        studyType,
        orderedBy,
        orderedDate: orderedDate ? new Date(orderedDate) : undefined,
        status,
      },
    });

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating radiology order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🗑️ Delete Radiology Order
export const deleteRadiologyOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.radiologyOrder.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Radiology order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

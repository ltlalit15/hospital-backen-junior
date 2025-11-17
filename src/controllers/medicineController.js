import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Create Medicine
export const createMedicine = async (req, res) => {
  try {
    const {
      brandName,
      genericName,
      strength,
      stock,
      reorderLevel,
      expiryDate,
      manufacturer,
      batchNumber,
      status,
      notes,
    } = req.body;

    const newMedicine = await prisma.medicine.create({
      data: {
        brandName,
        genericName,
        strength,
        stock: Number(stock),
        reorderLevel: Number(reorderLevel),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        manufacturer,
        batchNumber,
        status,
        notes,
      },
    });

    res.status(201).json({
      message: "Medicine created successfully",
      data: newMedicine,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating medicine", error: error.message });
  }
};

// ✅ Get All Medicines
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicines", error: error.message });
  }
};

// ✅ Get Single Medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await prisma.medicine.findUnique({
      where: { id: Number(id) },
    });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medicine", error: error.message });
  }
};

// ✅ Update Medicine (PUT or PATCH)
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const medicine = await prisma.medicine.update({
      where: { id: Number(id) },
      data: {
        ...updatedData,
        expiryDate: updatedData.expiryDate ? new Date(updatedData.expiryDate) : undefined,
      },
    });

    res.json({ message: "Medicine updated successfully", data: medicine });
  } catch (error) {
    res.status(500).json({ message: "Error updating medicine", error: error.message });
  }
};

// ✅ Delete Medicine
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.medicine.delete({ where: { id: Number(id) } });
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting medicine", error: error.message });
  }
};

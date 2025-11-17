import prisma from "../config/prismaClient.js";

// ✅ Create Prescription
export const createPrescription = async (req, res) => {
  try {
    const { prescriptionNumber, patientId, doctorId, notes, referralCodeId, items } = req.body;

    const prescription = await prisma.prescription.create({
      data: {
        prescriptionNumber,
        patientId,
        doctorId,
        notes,
        referralCodeId,
        items: {
          create: items?.map((item) => ({
            medicineId: Number(item.medicineId),
            dosage: item.dosage || "",
            quantity: Number(item.quantity || 1),
            durationDays: Number(item.durationDays || 0),
          })) || [],
        },
      },
      include: {
        patient: true,
        doctor: true,
        items: true,
      },
    });

    res.status(201).json({ message: "Prescription created successfully", data: prescription });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create prescription", error: error.message });
  }
};


// ✅ Get All Prescriptions
// ✅ Get all prescriptions with patient & doctor (including user)
// Get all prescriptions
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        items: { include: { medicine: true } }, // ✅ Include medicine
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions", error });
  }
};

// Get single prescription
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await prisma.prescription.findUnique({
      where: { id: Number(id) },
      include: {
        patient: true,
        doctor: true,
        items: { include: { medicine: true } }, // ✅ Include medicine
      },
    });
    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescription", error });
  }
};


// ✅ Update Prescription
export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, isActive } = req.body;

    const updatedPrescription = await prisma.prescription.update({
      where: { id: Number(id) },
      data: { notes, isActive },
    });

    res.json({
      message: "Prescription updated successfully",
      data: updatedPrescription,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update prescription",
      error: error.message,
    });
  }
};

// ✅ Delete Prescription
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.prescription.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete prescription",
      error: error.message,
    });
  }
};




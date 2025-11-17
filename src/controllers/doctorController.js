import prisma from "../config/prismaClient.js";

// ✅ Get all doctors (with user + department)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = doctors.map((doc) => ({  
      id: doc.id,
      publicId: doc.publicId,
      doctorCode: doc.doctorCode,
      fullName: `${doc.user?.firstName || ""} ${doc.user?.lastName || ""}`.trim(),
      email: doc.user?.email || "-",
      phone: doc.user?.phone || "-",
      gender: doc.user?.gender || "-",
      department: doc.department?.name || "N/A",
      speciality: doc.speciality || "-",
      qualifications: doc.qualifications || "-",
      isActive: doc.isActive,
      createdAt: doc.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors", error });
  }
};

// ✅ Get single doctor
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        department: true,
        appointments: true,
        prescriptions: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Error fetching doctor", error });
  }
};

// ✅ Create doctor
export const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      doctorCode,
      departmentId,
      speciality,
      qualifications,
      referralCodeId,
    } = req.body;

    const doctor = await prisma.doctor.create({
      data: {
        userId,
        doctorCode,
        departmentId,
        speciality,
        qualifications,
        referralCodeId,
      },
    });

    res.status(201).json({
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(400).json({
      message: "Failed to create doctor",
      error: error.message,
    });
  }
};

// ✅ Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      departmentId,
      speciality,
      qualifications,
      isActive,
      referralCodeId,
    } = req.body;

    const doctor = await prisma.doctor.update({
      where: { id: Number(id) },
      data: {
        departmentId,
        speciality,
        qualifications,
        isActive,
        referralCodeId,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(400).json({
      message: "Failed to update doctor",
      error: error.message,
    });
  }
};

// ✅ Soft delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.doctor.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date(), isActive: false },
    });

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(400).json({
      message: "Failed to delete doctor",
      error: error.message,
    });
  }
};

import prisma from "../config/prismaClient.js";
import bcrypt from "bcryptjs";

// 🧩 Create (Register) Patient
export const registerPatient = async (req, res) => {
  try {
    const {
      user,
      fatherName,
      nationalId,
      bloodGroup,
      allergies,
      medicalHistory,
      currentTreatment,
      height,
      weight,
      emergencyName,
      emergencyPhone,
      insuranceProvider,
      policyNumber,
      insuranceInfo,
      status,
    } = req.body;

    if (!user || !user.email || !user.password) {
      return res.status(400).json({ message: "User details (email & password) required" });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // ✅ Create patient and linked user
    const newPatient = await prisma.patient.create({
      data: {
        fatherName,
        nationalId,
        bloodGroup, // Must match enum (e.g. A_POSITIVE)
        allergies,
        medicalHistory,
        currentTreatment,
        height,
        weight,
        emergencyName,
        emergencyPhone,
        insuranceProvider,
        policyNumber,
        status,
        insuranceInfo,
        user: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: hashedPassword,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
            role: "PATIENT",
          },
        },
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({
      message: "Patient registered successfully",
      data: newPatient,
    });
  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({
      message: "Failed to register patient",
      error: error.message,
    });
  }
};

// 🧩 Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
};

// 🧩 Get single patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
};

// 🧩 Update patient
// export const updatePatient = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       fatherName,
//       nationalId,
//       bloodGroup,
//       allergies,
//       medicalHistory,
//       currentTreatment,
//       height,
//       weight,
//       emergencyName,
//       emergencyPhone,
//       insuranceProvider,
//       policyNumber,
//       insuranceInfo,
//       status,
//     } = req.body;

//     const updatedPatient = await prisma.patient.update({
//       where: { id: Number(id) },
//       data: {
//         fatherName,
//         nationalId,
//         bloodGroup,
//         allergies,
//         medicalHistory,
//         currentTreatment,
//         height,
//         weight,
//         emergencyName,
//         emergencyPhone,
//         insuranceProvider,
//         policyNumber,
//         insuranceInfo,
//         status,
//       },
//       include: { user: true },
//     });

//     res.json({ message: "Patient updated successfully", data: updatedPatient });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating patient", error: error.message });
//   }
// };


// 🧩 Update patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      user,
      fatherName,
      nationalId,
      bloodGroup,
      allergies,
      medicalHistory,
      currentTreatment,
      height,
      weight,
      emergencyName,
      emergencyPhone,
      insuranceProvider,
      policyNumber,
      insuranceInfo,
      status,
    } = req.body;

    const updatedPatient = await prisma.patient.update({
      where: { id: Number(id) },
      data: {
        fatherName,
        nationalId,
        bloodGroup,
        allergies,
        medicalHistory,
        currentTreatment,
        height,
        weight,
        emergencyName,
        emergencyPhone,
        insuranceProvider,
        policyNumber,
        insuranceInfo,
        status,

        // 🔥 UPDATE USER (THIS WAS MISSING)
        user: {
          update: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth
              ? new Date(user.dateOfBirth)
              : undefined,

            // 🔥 Optional: update password if provided
            ...(user.password && {
              password: await bcrypt.hash(user.password, 10),
            }),
          },
        },
      },
      include: { user: true },
    });

    res.json({
      message: "Patient updated successfully",
      data: updatedPatient,
    });

  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({
      message: "Error updating patient",
      error: error.message,
    });
  }
};

// 🧩 Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.patient.delete({ where: { id: Number(id) } });
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient", error: error.message });
  }
};

export const getPatientCount = async (req, res) => {
  try {
    const count = await prisma.patient.count();
    res.json({ totalPatients: count });
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

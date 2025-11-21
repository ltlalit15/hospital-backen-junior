
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// // 📌 CREATE Appointment
// export const createAppointment = async (req, res) => {
//   try {
//     const {
//       appointmentNumber,
//       patientId,
//       doctorId,
//       departmentId,
//       scheduledAt,
//       status,
//       reason,
//       notes,  
//     } = req.body;

//     // Create appointment record
//     const appointment = await prisma.appointment.create({
//       data: {
//         appointmentNumber:appointmentNumber,
//         patientId: Number(patientId),
//         doctorId: doctorId ? Number(doctorId) : null,
//         departmentId: departmentId ? Number(departmentId) : null,
//         scheduledAt: new Date(scheduledAt),
//         status,
//         reason,
//         notes,
//       },
//       include: {
//         patient: {
//           select: { id: true, fatherName: true, bloodGroup: true },
//         },
//         doctor: {
//           select: { id: true, doctorCode: true, speciality: true },
//         },
//         department: { select: { id: true, name: true } },
//       },
//     });

//     res.status(201).json({
//       message: "✅ Appointment created successfully",
//       data: appointment,
//     });
//   } catch (error) {
//     console.error("❌ Error creating appointment:", error);
//     res.status(500).json({ message: "Error creating appointment", error });
//   }
// };

// // 📌 READ — Get All Appointments
// export const getAllAppointments = async (req, res) => {
//   try {
//     const appointments = await prisma.appointment.findMany({
//       where: { isDeleted: false },
//       orderBy: { createdAt: "desc" },
//       include: {
//         patient: {
//           select: { id: true, fatherName: true, bloodGroup: true },
//         },
//         doctor: {
//           select: { id: true, doctorCode: true, speciality: true },
//         },
//         department: { select: { id: true, name: true } },
//       },
//     });

//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error("❌ Error fetching appointments:", error);
//     res.status(500).json({ message: "Error fetching appointments", error });
//   }
// };



// // 📌 READ — Get Appointment by ID
// export const getAppointmentById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const appointment = await prisma.appointment.findUnique({
//       where: { id: Number(id) },
//       include: {
//         patient: true,
//         doctor: true,
//         department: true,
//       },
//     });

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.status(200).json(appointment);
//   } catch (error) {
//     console.error("❌ Error fetching appointment:", error);
//     res.status(500).json({ message: "Error fetching appointment", error });
//   }
// };

// // 📌 UPDATE Appointment
// export const updateAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       patientId,
//       doctorId,
//       departmentId,
//       scheduledAt,
//       status,
//       reason,
//       notes,
//     } = req.body;

//     const appointment = await prisma.appointment.update({
//       where: { id: Number(id) },
//       data: {
//         patientId: patientId ? Number(patientId) : undefined,
//         doctorId: doctorId ? Number(doctorId) : undefined,
//         departmentId: departmentId ? Number(departmentId) : undefined,
//         scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
//         status,
//         reason,
//         notes,
//       },
//     });

//     res.status(200).json({
//       message: "✅ Appointment updated successfully",
//       data: appointment,
//     });
//   } catch (error) {
//     console.error("❌ Error updating appointment:", error);
//     res.status(500).json({ message: "Error updating appointment", error });
//   }
// };

// // 📌 DELETE Appointment (soft delete)
// export const deleteAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await prisma.appointment.update({
//       where: { id: Number(id) },
//       data: { isDeleted: true, isActive: false, deletedAt: new Date() },
//     });

//     res.status(200).json({ message: "✅ Appointment deleted successfully" });
//   } catch (error) {
//     console.error("❌ Error deleting appointment:", error);
//     res.status(500).json({ message: "Error deleting appointment", error });
//   }
// };












import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Generate unique appointment number: A-1001, A-1002 etc.
 */
async function generateAppointmentNumber() {
  const last = await prisma.appointment.findFirst({
    orderBy: { id: "desc" },
  });

  const lastNumber = last?.appointmentNumber
    ? parseInt(last.appointmentNumber.split("-")[1])
    : 1000;

  return `A-${lastNumber + 1}`;
}

/**
 * Create Appointment
 */
export const createAppointment = async (req, res) => {
  try {
    let {
      patientId,
      doctorId,
      departmentId,
      scheduledAt,
      status,
      reason,
      notes,
    } = req.body;

    // 🔥 Step 1: VALIDATE STATUS (must match Prisma enum)
    const allowedStatus = [
      "SCHEDULED",
      "CONFIRMED",
      "CHECKED_IN",
      "IN_CONSULTATION",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
      "RESCHEDULED",
    ];

    if (!allowedStatus.includes(status)) {
      status = "SCHEDULED"; // fallback default
    }

    // 🔥 Step 2: Auto-generate appointment number
    const appointmentNumber = await generateAppointmentNumber();

    // 🔥 Step 3: Create Appointment
   const appointment = await prisma.appointment.create({
  data: {
    appointmentNumber,
    patientId: Number(patientId),
    doctorId: Number(doctorId),
    departmentId: departmentId ? Number(departmentId) : null,
    scheduledAt: new Date(scheduledAt),
    durationMins: Number(req.body.durationMins || 30),   // ✅ FIX ADDED
    status,
    reason: reason || null,
    notes: notes || null,
  },


      include: {
        patient: {
          select: {
            id: true,
            fatherName: true,
            bloodGroup: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        doctor: {
          select: {
            id: true,
            doctorCode: true,
            speciality: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully!",
      data: appointment,
    });
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

/**
 * Get All Appointments
 */
export const getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: {
            id: true,
            fatherName: true,
            bloodGroup: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        doctor: {
          select: {
            id: true,
            doctorCode: true,
            speciality: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        department: {
          select: { id: true, name: true },
        },
      },
    });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update Appointment
 */
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    const allowedStatus = [
      "SCHEDULED",
      "CONFIRMED",
      "CHECKED_IN",
      "IN_CONSULTATION",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
      "RESCHEDULED",
    ];

    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status value", allowedStatus });
    }

    const updated = await prisma.appointment.update({
  where: { id: Number(id) },
  data: {
    patientId: Number(req.body.patientId),
    doctorId: Number(req.body.doctorId),
    scheduledAt: new Date(req.body.scheduledAt),
    durationMins: Number(req.body.durationMins || 30),   // ✅ FIX
    status: req.body.status,
    reason: req.body.reason,
    notes: req.body.notes,
  },
    })
;
    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error updating appointment:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete Appointment
 */
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting appointment:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};





//add new for deshboard 
export const getRecentAppointments = async (req, res) => {
  try {
    const list = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } }
      }
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};



export const getTodayAppointmentsForDoctor = async (req, res) => {
  try {
    // Step 1: Get userId from token
    const userId = req.user.id;

    // Step 2: Find doctor record using userId
    const doctor = await prisma.doctor.findUnique({
      where: { userId: Number(userId) },
    });

    if (!doctor) {
      return res.json([]);  // Doctor record not found
    }

    const doctorId = doctor.id;

    // Step 3: Get today's appointments for this doctor
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        scheduledAt: { gte: start, lte: end }
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } }
      },
      orderBy: { scheduledAt: "asc" }
    });

    return res.json(appointments);

  } catch (error) {
    console.error("Doctor Today Appt Error:", error);
    return res.status(500).json({ message: "Failed", error: error.message });
  }
};

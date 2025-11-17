// src/controllers/attendance.controller.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ===============================
// ✅ CREATE ATTENDANCE RECORD
// ===============================
export const createAttendance = async (req, res) => {
  try {
    const { staffId, date, shiftType, status, checkInTime, checkOutTime, remarks } = req.body;

    if (!staffId || !date || !shiftType) {
      return res.status(400).json({
        success: false,
        message: "staffId, date, and shiftType are required.",
      });
    }

    // Check if attendance for this staff on this date already exists
    const existing = await prisma.staffAttendance.findFirst({
      where: { staffId: Number(staffId), date: new Date(date) },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance for this staff already exists for the given date.",
      });
    }

    const newAttendance = await prisma.staffAttendance.create({
      data: {
        staffId: Number(staffId),
        date: new Date(date),
        shiftType,
        status,
        checkInTime: checkInTime ? new Date(checkInTime) : null,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
        remarks,
      },
      include: { staff: true },
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully.",
      data: newAttendance,
    });
  } catch (error) {
    console.error("❌ Error creating attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// ✅ GET ALL ATTENDANCE RECORDS
// ===============================
export const getAllAttendance = async (req, res) => {
  try {
    const { date, staffId } = req.query;

    const filters = {};
    if (date) filters.date = new Date(date);
    if (staffId) filters.staffId = Number(staffId);

    const attendanceRecords = await prisma.staffAttendance.findMany({
      where: filters,
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// ✅ GET ATTENDANCE BY ID
// ===============================
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await prisma.staffAttendance.findUnique({
      where: { id },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            email: true,
          },
        },
      },
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found." });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("❌ Error fetching attendance by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// ✅ UPDATE ATTENDANCE
// ===============================
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { shiftType, status, checkInTime, checkOutTime, remarks } = req.body;

    const existing = await prisma.staffAttendance.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Attendance not found." });
    }

    const updated = await prisma.staffAttendance.update({
      where: { id },
      data: {
        shiftType: shiftType || existing.shiftType,
        status: status || existing.status,
        checkInTime: checkInTime ? new Date(checkInTime) : existing.checkInTime,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : existing.checkOutTime,
        remarks: remarks || existing.remarks,
      },
      include: { staff: true },
    });

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// ✅ DELETE ATTENDANCE
// ===============================
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.staffAttendance.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Attendance deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting attendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



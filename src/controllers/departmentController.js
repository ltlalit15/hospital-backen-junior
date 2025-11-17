import prisma from "../config/prismaClient.js";

/**
 * 🏥 Create Department
 */
export const createDepartment = async (req, res) => {
  try {
    const { name, code, description, type, isActive } = req.body;

    // ✅ Check duplicate code or name
    const existing = await prisma.department.findFirst({
      where: {
        OR: [{ name }, { code }],
      },
    });
    if (existing) {
      return res.status(400).json({ message: "Department with same name or code already exists" });
    }

    const department = await prisma.department.create({
      data: {
        name,
        code,
        description,
        type: type || "CLINICAL",
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("❌ Error creating department:", error);
    res.status(500).json({ message: "Failed to create department", error: error.message });
  }
};

/**
 * 📋 Get All Departments
 */
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });

    res.json(departments);
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    res.status(500).json({ message: "Failed to fetch departments", error: error.message });
  }
};

/**
 * 🔍 Get Single Department
 */
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch department", error: error.message });
  }
};

/**
 * ✏️ Update Department
 */
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.department.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json({
      message: "Department updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update department", error: error.message });
  }
};

/**
 * ❌ Soft Delete Department
 */
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.department.update({
      where: { id: Number(id) },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    res.json({
      message: "Department deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete department", error: error.message });
  }
};

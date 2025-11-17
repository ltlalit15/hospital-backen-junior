import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* ------------------------------------------------------------------
   🟣 GET ALL NURSES
------------------------------------------------------------------ */
export const getAllNurses = async (req, res) => {
  try {
    const nurses = await prisma.nurse.findMany({
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
        department: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = nurses.map((n) => ({
      id: n.id,
      publicId: n.publicId,
      fullName: `${n.user?.firstName || ""} ${n.user?.lastName || ""}`.trim(),
      email: n.user?.email,
      phone: n.user?.phone,
      gender: n.user?.gender,
      ward: n.ward || "-",
      department: n.department?.name || "N/A",
      createdAt: n.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching nurses:", err);
    res.status(500).json({ message: "Error fetching nurses" });
  }
};

/* ------------------------------------------------------------------
   🟣 GET NURSE BY ID
------------------------------------------------------------------ */
export const getNurseById = async (req, res) => {
  try {
    const nurse = await prisma.nurse.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: true,
        department: true,
      },
    });

    if (!nurse) return res.status(404).json({ message: "Nurse not found" });

    res.status(200).json(nurse);
  } catch (err) {
    res.status(500).json({ message: "Error fetching nurse" });
  }
};

/* ------------------------------------------------------------------
   🟣 UPDATE NURSE
------------------------------------------------------------------ */
export const updateNurse = async (req, res) => {
  try {
    const { ward, departmentId } = req.body;

    const nurse = await prisma.nurse.update({
      where: { id: Number(req.params.id) },
      data: {
        ward: ward ?? undefined,
        departmentId: departmentId ? Number(departmentId) : undefined,
      },
    });

    res.status(200).json({
      message: "Nurse updated successfully",
      data: nurse,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating nurse" });
  }
};

/* ------------------------------------------------------------------
   🟣 DELETE NURSE (soft delete)
------------------------------------------------------------------ */
export const deleteNurse = async (req, res) => {
  try {
    await prisma.nurse.update({
      where: { id: Number(req.params.id) },
      data: {
        deletedAt: new Date(),
      },
    });

    res.status(200).json({ message: "Nurse deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting nurse" });
  }
};

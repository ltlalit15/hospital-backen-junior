import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Add new beacon
export const createBeacon = async (req, res) => {
  try {
    const { beaconCode, zoneName, building, floor } = req.body;

    if (!beaconCode || !zoneName) {
      return res.status(400).json({ message: "Beacon code and zone name are required" });
    }

    const beacon = await prisma.beacon.create({
      data: {
        beaconCode,
        zoneName,
        building,
        floor,
      },
    });

    res.status(201).json({ message: "Beacon created successfully", beacon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating beacon", error });
  }
};

// Get all beacons
export const getAllBeacons = async (req, res) => {
  try {
    const beacons = await prisma.beacon.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ message: "All beacons fetched successfully", beacons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching beacons", error });
  }
};

// Get single beacon by ID
export const getBeaconById = async (req, res) => {
  try {
    const { id } = req.params;
    const beacon = await prisma.beacon.findUnique({
      where: { id: Number(id) },
    });

    if (!beacon) {
      return res.status(404).json({ message: "Beacon not found" });
    }

    res.status(200).json({ beacon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching beacon", error });
  }
};

// Update beacon
export const updateBeacon = async (req, res) => {
  try {
    const { id } = req.params;
    const { zoneName, building, floor, isActive } = req.body;

    const updated = await prisma.beacon.update({
      where: { id: Number(id) },
      data: { zoneName, building, floor, isActive },
    });

    res.status(200).json({ message: "Beacon updated successfully", updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating beacon", error });
  }
};

// Delete beacon
export const deleteBeacon = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.beacon.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Beacon deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting beacon", error });
  }
};

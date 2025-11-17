import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Add or Update User Location
export const updateUserLocation = async (req, res) => {
  try {
    const { userId, beaconId } = req.body;

    if (!userId || !beaconId) {
      return res.status(400).json({ message: "userId and beaconId are required" });
    }

    // Check if user already has a tracking record
    const existing = await prisma.locationTracking.findUnique({
      where: { userId: Number(userId) },
    });

    let tracking;

    if (existing) {
      // Update existing location
      tracking = await prisma.locationTracking.update({
        where: { userId: Number(userId) },
        data: {
          beaconId: Number(beaconId),
          lastSeen: new Date(),
          isActive: true,
        },
        include: {
          user: true,
          beacon: true,
        },
      });
    } else {
      // Create new location record
      tracking = await prisma.locationTracking.create({
        data: {
          userId: Number(userId),
          beaconId: Number(beaconId),
        },
        include: {
          user: true,
          beacon: true,
        },
      });
    }

    res.status(200).json({
      message: "User location updated successfully",
      tracking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user location", error });
  }
};

// ✅ Get all active users' latest locations (for Admin dashboard)
export const getAllActiveLocations = async (req, res) => {
  try {
    const locations = await prisma.locationTracking.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        beacon: {
          select: {
            beaconCode: true,
            zoneName: true,
            building: true,
            floor: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "All active user locations fetched successfully",
      locations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching locations", error });
  }
};

// ✅ Deactivate a user location (optional)
export const deactivateLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.locationTracking.update({
      where: { userId: Number(userId) },
      data: { isActive: false },
    });

    res.status(200).json({ message: "User location deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deactivating location", error });
  }
};

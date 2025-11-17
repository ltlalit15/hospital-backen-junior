import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Seeding admin user...");

  // ✅ Create a real bcrypt hash for "admin123"
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@hospital.com" },
    update: {
      password: hashedPassword, // ✅ Update old password with real hash
    },
    create: {
      email: "admin@hospital.com",
      password: hashedPassword,
      role: "ADMIN",
      firstName: "Super",
      lastName: "Admin",
      isActive: true,
    },
  });

  console.log("✅ Admin user seeded successfully with real bcrypt hash!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

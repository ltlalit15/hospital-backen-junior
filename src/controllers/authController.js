import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟢 Login attempt:", { email, password }); // ✅ log input

    // 1️⃣ Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(401).json({ message: "Invalid credentials! (User not found)" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔐 Stored password hash:", user.password);

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🧩 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch for email:", email);
      return res.status(401).json({ message: "Invalid credentials! (Password mismatch)" });
    }

    // 3️⃣ Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    console.log("✅ JWT token generated for:", user.email);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};





// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const prisma = new PrismaClient();

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("🟢 Login attempt:", { email, password });

//     // 1️⃣ Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       console.log("❌ User not found for email:", email);
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials (User not found)" });
//     }

//     // 2️⃣ Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("❌ Password mismatch for email:", email);
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials (Password mismatch)" });
//     }

//     // 3️⃣ Generate token
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET || "supersecret",
//       { expiresIn: "7d" }
//     );

//     console.log("✅ JWT generated for:", user.email);

//     // 4️⃣ Send final response (important for frontend)
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       role: user.role, // ✅ used in frontend redirect
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("🔥 Login Error:", error);
//     res.status(500).json({ success: false, message: "Server error during login" });
//   }
// };

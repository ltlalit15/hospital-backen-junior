// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const prisma = new PrismaClient();

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("🟢 Login attempt:", { email, password }); // ✅ log input

//     // 1️⃣ Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       console.log("❌ User not found for email:", email);
//       return res.status(401).json({ message: "Invalid credentials! (User not found)" });
//     }

//     console.log("✅ User found:", user.email);
//     console.log("🔐 Stored password hash:", user.password);

//     // 2️⃣ Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("🧩 Password match result:", isMatch);

//     if (!isMatch) {
//       console.log("❌ Password mismatch for email:", email);
//       return res.status(401).json({ message: "Invalid credentials! (Password mismatch)" });
//     }

//     // 3️⃣ Generate token
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET || "supersecret",
//       { expiresIn: "7d" }
//     );

//     console.log("✅ JWT token generated for:", user.email);

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("🔥 Login Error:", error);
//     res.status(500).json({ message: "Server error during login" });
//   }
// };





// // import { PrismaClient } from "@prisma/client";
// // import bcrypt from "bcryptjs";
// // import jwt from "jsonwebtoken";

// // const prisma = new PrismaClient();

// // export const loginUser = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     console.log("🟢 Login attempt:", { email, password });

// //     // 1️⃣ Check if user exists
// //     const user = await prisma.user.findUnique({
// //       where: { email },
// //     });

// //     if (!user) {
// //       console.log("❌ User not found for email:", email);
// //       return res
// //         .status(401)
// //         .json({ success: false, message: "Invalid credentials (User not found)" });
// //     }

// //     // 2️⃣ Compare passwords
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       console.log("❌ Password mismatch for email:", email);
// //       return res
// //         .status(401)
// //         .json({ success: false, message: "Invalid credentials (Password mismatch)" });
// //     }

// //     // 3️⃣ Generate token
// //     const token = jwt.sign(
// //       { id: user.id, role: user.role },
// //       process.env.JWT_SECRET || "supersecret",
// //       { expiresIn: "7d" }
// //     );

// //     console.log("✅ JWT generated for:", user.email);

// //     // 4️⃣ Send final response (important for frontend)
// //     res.status(200).json({
// //       success: true,
// //       message: "Login successful",
// //       token,
// //       role: user.role, // ✅ used in frontend redirect
// //       user: {
// //         id: user.id,
// //         email: user.email,
// //         name: user.name,
// //         role: user.role,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("🔥 Login Error:", error);
// //     res.status(500).json({ success: false, message: "Server error during login" });
// //   }
// // };









import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (User not found)",
      });
    }

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (Password mismatch)",
      });
    }

    // 3️⃣ Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "7d" }
    );

    // 4️⃣ Send Response
    res.status(200).json({
      success: true,         // ✔️ VERY IMPORTANT
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,     // ✔️ needed for role-based redirect
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};



export const patientSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      address,
      fatherName,
      bloodGroup,
    } = req.body;

    console.log("🟢 Signup payload:", req.body);

    if (!bloodGroup) {
      return res.status(400).json({
        success: false,
        message: "Blood group is required",
      });
    }

    // 1️⃣ Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        phone,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        address,
       role: "PATIENT"

      },
    });

    // 2️⃣ Create Patient Profile
    const patient = await prisma.patient.create({
      data: {
        fatherName,
        bloodGroup, // ⭐ REQUIRED ⭐
        user: { connect: { id: user.id } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Patient account created successfully!",
      patient,
    });
  } catch (error) {
    console.error("🔥 Patient Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during signup",
      error,
    });
  }
};

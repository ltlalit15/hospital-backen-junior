


// import prisma from "../config/prismaClient.js";
// import bcrypt from "bcrypt";

/**
 * 👨‍⚕️ Create New Employee (and related role table)
 */
// export const createEmployee = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       phone,
//       role,
//       gender,
//       dateOfBirth,
//       address,
//       departmentId,
//       specialization,
//       qualification,
//       experience,
//       joinDate,
//       isActive,
//     } = req.body;

//     if (!email || !password || !role) {
//       return res
//         .status(400)
//         .json({ message: "Email, password, and role are required" });
//     }

//     // check if already exists
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User with this email already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         role,
//         firstName,
//         lastName,
//         displayName: `${firstName || ""} ${lastName || ""}`.trim(),
//         phone,
//         gender,
//         dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
//         address,
//       },
//     });

//     // employee code
//     const totalEmployees = await prisma.employee.count();
//     const employeeCode = `EMP${String(totalEmployees + 1).padStart(3, "0")}`;

//     // create employee
//     const employee = await prisma.employee.create({
//       data: {
//         userId: user.id,
//         departmentId: departmentId ? Number(departmentId) : null,
//         employeeCode,
//         role,
//         dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
//         phone,
//         gender,
//         address,
//         specialization,
//         qualification,
//         experience,
//         joinDate: joinDate ? new Date(joinDate) : new Date(),
//         isActive: isActive ?? true,
//       },
//       include: {
//         user: true,
//         department: true,
//       },
//     });

//     // ✅ create related table record based on role
//     if (role.toLowerCase() === "doctor") {
//       await prisma.doctor.create({
//         data: {
//           userId: user.id,
//           departmentId: departmentId ? Number(departmentId) : null,
//           doctorCode: `DOC${String(totalEmployees + 1).padStart(3, "0")}`,
//           speciality: specialization || null,
//           qualifications: qualification || null,
//           isActive: true,
//         },
//       });
//     } else if (role.toLowerCase() === "nurse") {
//       await prisma.nurse.create({
//         data: {
//           userId: user.id,
//           nurseCode: `NUR${String(totalEmployees + 1).padStart(3, "0")}`,
//           departmentId: departmentId ? Number(departmentId) : null,
//           qualification: qualification || null,
//           experience: experience || null,
//           isActive: true,
//         },
//       });
//     } else if (role.toLowerCase() === "receptionist") {
//       await prisma.receptionist.create({
//         data: {
//           userId: user.id,
//           receptionistCode: `REC${String(totalEmployees + 1).padStart(3, "0")}`,
//           departmentId: departmentId ? Number(departmentId) : null,
//           isActive: true,
//         },
//       });
//     }

//     res.status(201).json({
//       message: "✅ Employee created successfully with role-specific record",
//       data: employee,
//     });
//   } catch (error) {
//     console.error("❌ Error creating employee:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to create employee", error: error.message });
//   }
// };









import prisma from "../config/prismaClient.js";
import bcrypt from "bcrypt";

export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      gender,
      dateOfBirth,
      address,
      departmentId,
      specialization,
      qualification,
      experience,
      joinDate,
      ward,             // 👈 Nurse ke liye
      licenseNo,        // 👈 Pharmacist ke liye
      isActive,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create USER
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
        displayName: `${firstName || ""} ${lastName || ""}`.trim(),
        phone,
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
      },
    });

    const totalEmployees = await prisma.employee.count();
    const employeeCode = `EMP${String(totalEmployees + 1).padStart(3, "0")}`;

    // Create EMPLOYEE
    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        departmentId: departmentId ? Number(departmentId) : null,
        employeeCode,
        role,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        phone,
        gender,
        address,
        specialization: specialization || null,
        qualification: qualification || null,
        experience: experience || null,
        joinDate: joinDate ? new Date(joinDate) : new Date(),
        isActive: isActive ?? true,
      },
      include: {
        user: true,
        department: true,
      },
    });

    const roleLower = role.toLowerCase();

    /* ------------------------------------------------------------------
     🚑 DOCTOR
    ------------------------------------------------------------------ */
    if (roleLower === "doctor") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          doctorCode: `DOC${String(totalEmployees + 1).padStart(3, "0")}`,
          departmentId: departmentId ? Number(departmentId) : null,
          speciality: specialization || null,
          qualifications: qualification || null,
          isActive: true,
        },
      });
    }

    /* ------------------------------------------------------------------
     👩‍⚕️ NURSE
     Schema:
       ward: String?
    ------------------------------------------------------------------ */
    if (roleLower === "nurse") {
      await prisma.nurse.create({
        data: {
          userId: user.id,
          publicId: crypto.randomUUID(),
          nurseCode: `NUR${String(totalEmployees + 1).padStart(3, "0")}`,
          departmentId: departmentId ? Number(departmentId) : null,
          ward: ward || null,
        },
      });
    }

    /* ------------------------------------------------------------------
     💊 PHARMACIST
     Schema:
       licenseNo: String?
       specialization: String?
    ------------------------------------------------------------------ */
    if (roleLower === "pharmacist") {
      await prisma.pharmacist.create({
  data: {
    userId: user.id,
    publicId: crypto.randomUUID(),
    departmentId: departmentId ? Number(departmentId) : null,
    licenseNo: licenseNo || null,
    specialization: specialization || null,
  },
});
    }

    /* ------------------------------------------------------------------
     🧑‍💼 RECEPTIONIST
    ------------------------------------------------------------------ */
    if (roleLower === "receptionist") {
      await prisma.receptionist.create({
        data: {
          userId: user.id,
          receptionistCode: `REC${String(totalEmployees + 1).padStart(3, "0")}`,
          departmentId: departmentId ? Number(departmentId) : null,
          isActive: true,
        },
      });
    }

    res.status(201).json({
      message: "✅ Employee + Role created successfully",
      data: employee,
    });

  } catch (error) {
    console.error("❌ Error creating employee:", error);
    res.status(500).json({
      message: "Failed to create employee",
      error: error.message,
    });
  }
};



/**
 * 📋 Get All Employees
 */
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: { user: true, department: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(employees);
    // res.json({
    //   success: true,
    //   data: employees,   // ⭐ THIS makes staff dropdown work
    // });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch employees", error: error.message });
  }
};



/**
 * 🔍 Get Single Employee by ID
 */
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
      include: { user: true, department: true },
    });

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch employee", error: error.message });
  }
};

/**
 * ✏️ Update Employee
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      departmentId,
      specialization,
      qualification,
      experience,
      joinDate,
      role,
      isActive,
      user,
    } = req.body;

    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: {
        specialization,
        qualification,
        experience,
        joinDate: joinDate ? new Date(joinDate) : undefined,
        role,
        isActive,
        ...(departmentId && {
          department: { connect: { id: departmentId } },
        }),
        user: {
          update: {
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth
              ? new Date(user.dateOfBirth)
              : undefined,
            address: user.address,
          },
        },
      },
      include: { user: true, department: true },
    });

    res.json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update employee", error: error.message });
  }
};

/**
 * 🗑️ Soft Delete Employee
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.employee.update({
      where: { id: Number(id) },
      data: { isActive: false, deletedAt: new Date() },
    });

    res.json({ message: "Employee deleted successfully", data: deleted });
  } catch (error) {
    console.error("❌ Error deleting employee:", error);
    res
      .status(500)
      .json({ message: "Failed to delete employee", error: error.message });
  }
};





export const getStaffCount = async (req, res) => {
  try {
    const count = await prisma.employee.count({ where: { isActive: true } });
    res.json({ totalStaff: count });
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message });
  }
};

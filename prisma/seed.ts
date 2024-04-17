import { UserRole } from "@prisma/client";
import prisma from "../src/shared/prisma";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    const isExitsSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    if (isExitsSuperAdmin) {
      console.log("super admin is already exist");
      return;
    }

    const hashPassword=await bcrypt.hash("superadmin", 12);

    const superAdminData = await prisma.user.create({
      data: {
        email: "superadmin@gmail.com",
        password: hashPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Md.saiful Islam",
            contactNumber: "01874767969",
            // email:'sobujapm87@gmail.com'
          },
        },
      },
    });
    console.log("super admin created successfully", superAdminData);

  } catch (err) {
    console.error(err);
  }
  finally{
    await prisma.$disconnect();
  }
};

seedSuperAdmin()

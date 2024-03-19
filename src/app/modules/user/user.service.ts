import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";



const createAdmin = async (data: any) => {
  console.log(data);
  const hashPassword:string = await bcrypt.hash(data.password,12)


  const userData = {
    email: data.admin.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
     await transactionClient.user.create({
      data: userData
    });
    const createdadminData = await transactionClient.admin.create({
      data: data.admin
    });
    return createdadminData;
  });

  return result;
};

export const userServices = {
  createAdmin,
};

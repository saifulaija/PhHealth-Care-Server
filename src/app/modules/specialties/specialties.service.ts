import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { fileUpLoader } from "./../../../helpers/uploader";

const createSpecialtiesItToDB = async (req: Request & { file?: IFile }) => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUpLoader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllSpecialtiesFromDB=async()=>{
   const result = await prisma.specialties.findMany();
   return result
}

const deleteSpecialtiesFromDB=async(id:string)=>{
const result = await prisma.specialties.delete({
  where:{
    id
  }
})

return result
}

export const specialtiesServices = {
  createSpecialtiesItToDB,
  getAllSpecialtiesFromDB,
  deleteSpecialtiesFromDB
};

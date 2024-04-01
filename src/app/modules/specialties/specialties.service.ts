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

export const specialtiesServices = {
  createSpecialtiesItToDB,
};

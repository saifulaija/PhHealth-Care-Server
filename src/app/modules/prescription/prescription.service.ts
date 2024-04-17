import { AppoinmentStatus, Prescription, paymentStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpers/paginationHelpers";

const insertIntoDB = async (
  user: IAuthUser,
  payload: Partial<Prescription>
) => {
  const appoinmentData = await prisma.appoinment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppoinmentStatus.COMPLETED,
      paymentStatus: paymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });
  if (!(user?.email === appoinmentData.doctor.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment");
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appoinmentData.id,
      doctorId: appoinmentData.doctorId,
      patientId: appoinmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null || undefined,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

const patientPrescription = async (user: IAuthUser,options:IPaginationOptions) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const result = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user?.email,
      },
    },
    skip,
    take:limit,
    orderBy:options.sortBy && options.sortOrder 
    ? {[options.sortBy]:options.sortOrder}
    :{createdAt:'desc'},
    include:{
        doctor:true,
        patient:true,
        appoinment:true
    }
  });

  const total = await prisma.prescription.count({
    where:{
        patient:{
            email:user?.email
        }
    }
  })
  return {
    meta:{
        total,
        page,
        limit
    },
    data:result
  };
};

export const prescriptionServices = {
  insertIntoDB,
  patientPrescription,
};

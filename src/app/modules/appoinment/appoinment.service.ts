import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { AppoinmentStatus, Prisma, UserRole, paymentStatus } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createAppoinment = async (user: IAuthUser, payload: any) => {
  //checked patient
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  //check doctor
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  //check schedule or slot
  await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  //create video calling id

  const videoCallingId: string = uuidv4();
  const result = await prisma.$transaction(async (tx) => {
    const appoinmentData = await tx.appoinment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appoinmentData.id,
      },
    });

    //create tranasaction id
    const today = new Date();

    const tranasactionId =
      "PH-HealthCare-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDay() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes();

    await tx.payment.create({
      data: {
        appointmentId: appoinmentData.id,
        amount: doctorData.appoitmentFee,
        tranasctionId: tranasactionId,
      },
    });

    return appoinmentData;
  });

  return result;
};

const getMyAppoinment = async (
  user: IAuthUser,
  filters: any,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { ...filterData } = filters;
  const andConditions: Prisma.AppoinmentWhereInput[] = [];

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppoinmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appoinment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          },
  });

  const total = await prisma.appoinment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const changeAppointmentStatus = async (
  appointmentId: string,
  status: AppoinmentStatus,
  user: IAuthUser
) => {
  const appointmentData = await prisma.appoinment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "this is not your appoinment");
    }
  }

  const result = await prisma.appoinment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });

  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const unPaidAppointments=await prisma.appoinment.findMany({
    where:{
      createdAt:{
        lte:thirtyMinutesAgo
      },
      paymentStatus:paymentStatus.UNPAID
    }
  })

  const appoinmentIdsToCancel = unPaidAppointments.map(appointment=>appointment.id)
 
  await prisma.$transaction(async(tx)=>{
    await tx.payment.deleteMany({
      where:{
        appointmentId:{
          in:appoinmentIdsToCancel
        }
      }
    });
    await tx.appoinment.deleteMany({
      where:{
        id:{
          in:appoinmentIdsToCancel
        }
      }
    });
    for(const unPaidAppointment of unPaidAppointments){
      await tx.doctorSchedule.updateMany({
        where:{
         doctorId:unPaidAppointment.doctorId,
         scheduleId:unPaidAppointment.scheduleId
        },
        data:{
          isBooked:false
        }
      })
    }
  })


  console.log('updated')
};

export const appoinmentServices = {
  createAppoinment,
  getMyAppoinment,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};

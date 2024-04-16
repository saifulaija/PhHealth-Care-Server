import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";

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
  const doctorScheduleData = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  //create video calling id

  const videoCallingId = uuidv4();
  const result=await prisma.appoinment.create({
    data:{
        patientId:patientData.id,
        doctorId:doctorData.id,
        scheduleId:payload.scheduleId,
       videoCallingId
    },
    include:{
        patient:true,
        doctor:true,
        schedule:true
    }
  })

  return result
};

export const appoinmentServices = {
  createAppoinment,
};

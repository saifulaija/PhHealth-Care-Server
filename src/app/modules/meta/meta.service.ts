import { UserRole, paymentStatus } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
     metaData= getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
     metaData= getAdminMetaData();
      break;
    case UserRole.DOCTOR:
     metaData= getDoctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
     metaData= getPatientMetaData(user);
      break;
    default:
      throw new Error("Invalid user role");
  }
  return metaData;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appoinment.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const patientCount = await prisma.patient.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where:{
      status:paymentStatus.PAID
    }
  });
  return{
    appointmentCount,doctorCount,patientCount,paymentCount,totalRevenue,adminCount
  }
};
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appoinment.count();
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
      
    },
    where:{
      status:paymentStatus.PAID
    }
  });
  return{
    appointmentCount,doctorCount,patientCount,paymentCount,totalRevenue
  }
};

const getDoctorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appoinment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appoinment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appoinment: {
        doctorId: doctorData.id,
      },
      status:paymentStatus.PAID
    },
  });

  const appoinmentStatusDistribution = await prisma.appoinment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formatedAppoinmentStatusDistribution = appoinmentStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: Number(_count.id),
    })
  );

  // console.dir(formatedAppoinmentStatusDistribution, { depth: "infinity" });

  return {
    appointmentCount,patientCount:patientCount.length,reviewCount,totalRevenue,formatedAppoinmentStatusDistribution
  }
};



const getPatientMetaData = async (user:IAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });


  const appointmentCount = await prisma.appoinment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
   where:{
    patientId:patientData.id
   }
  });



  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });



  const appoinmentStatusDistribution = await prisma.appoinment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });

  const formatedAppoinmentStatusDistribution = appoinmentStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: Number(_count.id),
    })
  );

  // console.dir(formatedAppoinmentStatusDistribution, { depth: "infinity" });

  return {
    appointmentCount,prescriptionCount,reviewCount,formatedAppoinmentStatusDistribution
  }
};

export const metaServices = {
  fetchDashboardMetaData,
};

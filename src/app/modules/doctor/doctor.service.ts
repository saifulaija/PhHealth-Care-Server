import { Doctor, DoctorSpecialties, Prisma, Specialties } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IDoctorFilterRequest, IDoctorUpdate } from "./doctor.interface";
import { paginationHelper } from "../../../helpers/paginationHelpers";
import { doctorSearchableFields } from "./doctor.constant";
import { IPaginationOptions } from "../../interfaces/paginations";

const updateDoctorIntoDB = async (id: string, payload: IDoctorUpdate) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      // delete specialties
      const deleteSpecialtiesIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );
      //console.log(deleteSpecialtiesIds)
      for (const specialty of deleteSpecialtiesIds) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
      }

      // create specialties
      const createSpecialtiesIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      console.log(createSpecialtiesIds);
      for (const specialty of createSpecialtiesIds) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
      andConditions.push({
          OR: doctorSearchableFields.map(field => ({
              [field]: {
                  contains: searchTerm,
                  mode: 'insensitive',
              },
          })),
      });
  };

  // doctor > doctorSpecialties > specialties -> title

  if (specialties && specialties.length > 0) {
      andConditions.push({
          doctorSpecialties: {
              some: {
                  specialities: {
                      title: {
                          contains: specialties,
                          mode: 'insensitive'
                      }
                  }
              }
          }
      })
  };


  if (Object.keys(filterData).length > 0) {
      const filterConditions = Object.keys(filterData).map(key => ({
          [key]: {
              equals: (filterData as any)[key],
          },
      }));
      andConditions.push(...filterConditions);
  }

  andConditions.push({
      isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : { averageRating: 'desc' },
      include: {
          doctorSpecialties: {
              include: {
                  specialities: true
              }
          }
      },
  });

  const total = await prisma.doctor.count({
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

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
      where: {
          id,
          isDeleted: false,
      },
      include: {
          doctorSpecialties: {
              include: {
                  specialities: true
              }
          }
      }
  });
  return result;
};


export const doctorServices = {
  updateDoctorIntoDB,
  getAllFromDB
};

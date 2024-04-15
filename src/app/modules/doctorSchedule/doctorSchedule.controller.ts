import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorSchedulesServices } from "./doctorSchedule.service";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";
import { pick } from "../../../shared/pick";

const insertIntoDB = catchAsync(async (req:Request & {user?:IAuthUser}, res:Response) => {
   const user = req.user;
  
    const result = await doctorSchedulesServices.insertIntoDB(user,req.body);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor scheduled created  successfully',
      data: result,
    });
  });

  const getMySchedule = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
      const filters = pick(req.query, ["startDate", "endDate","isBooked"]);
      const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  
      const user = req.user;
      const result = await doctorSchedulesServices.getMySchedule(
        filters,
        options,
        user as IAuthUser
      );
  
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule fatched successfully!",
        data: result,
      });
    }
  );
  const deleteFromDB = catchAsync(
    async (req: Request & { user?: IAuthUser }, res: Response) => {
      const user = req.user;
      const{id}=req.params
    
   const result =await doctorSchedulesServices.deleteFromDB(user as IAuthUser,id)
  
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result,
      });
    }
  );


  export const doctorScheduleContrpllers={
    insertIntoDB,getMySchedule,deleteFromDB
  }
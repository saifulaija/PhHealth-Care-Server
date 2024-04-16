import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { appoinmentServices } from "./appoinment.service";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";

const createAppoinment = catchAsync(async (req:Request & {user?:IAuthUser}, res:Response) => {

  const user = req.user;
  const result = await appoinmentServices.createAppoinment(user as IAuthUser,req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "appoinment booked successfully",
    data: result,
  });
});

export const appoinmentControllers = {
  createAppoinment,
};

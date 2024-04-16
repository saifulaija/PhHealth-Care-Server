import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { appoinmentServices } from "./appoinment.service";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";
import { pick } from "../../../shared/pick";

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
const getMyAppoinment = catchAsync(async (req:Request & {user?:IAuthUser}, res:Response) => {

  const user=req.user
  const filters=pick(req.query,['status','paymentStatus']);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await appoinmentServices.getMyAppoinment(user as IAuthUser,filters,options)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My appoinment fatched successfully",
    data: result,
  });
});

export const appoinmentControllers = {
  createAppoinment,getMyAppoinment
};

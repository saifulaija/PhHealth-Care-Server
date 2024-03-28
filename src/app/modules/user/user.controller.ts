import { Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields );
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  console.log(options);
  const result = await userServices.getAllUsers(filters, options);
  // res.status(200).json({
  //   success: true,
  //   message: "Admins retrived successfully",
  //   meta: result.meta,
  //   data: result.data,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "users  are retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});


const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const {id}=req.params


  const result = await userServices.changeProfileStatus(id,req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "status changed successfully",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus
};

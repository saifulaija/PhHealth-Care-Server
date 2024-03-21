import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";

const getAllADmins = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  console.log(options);
  const result = await adminServices.getAllADmins(filters, options);
  // res.status(200).json({
  //   success: true,
  //   message: "Admins retrived successfully",
  //   meta: result.meta,
  //   data: result.data,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await adminServices.getAdminById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "admin data fatchedd by id",
    data: result,
  });
});

const updateAdminData = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.updateAdminData(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "admin data updated successfully",
    data: result,
  });
});
const deleteAdminData = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.deleteAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "admin data deleted successfully",
    data: result,
  });
});

const softDeleteAdminData = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminServices.softDeleteAdmin(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "soft admin data deleted successfully",
    data: result,
  });
});
export const adminControllers = {
  getAllADmins,
  getAdminById,
  updateAdminData,
  deleteAdminData,
  softDeleteAdminData,
};

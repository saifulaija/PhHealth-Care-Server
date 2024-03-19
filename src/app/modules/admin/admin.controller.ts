import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";



const getAllADmins = async (req: Request, res: Response,next:NextFunction) => {

  try {
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

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success:true,
      message:'Admin retrived successfully',
      meta:result.meta,
      data:result.data
    })
  } catch (err) {
   next(err)
  }
};

const getAdminById = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await adminServices.getAdminById(id);
   sendResponse(res,{
    statusCode:httpStatus.OK,
    success:true,
    message:'admin data fatchedd by id',
    data:result
   })
  } catch (err) {
    next(err)
  }
};

const updateAdminData = async (req: Request, res: Response,next:NextFunction) => {
  const { id } = req.params;
  try {
    const result = await adminServices.updateAdminData(id, req.body);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success: true,
      message: "admin data updated successfully",
      data: result,
    })
  
  } catch (err) {
   next(err)
  }
};

const deleteAdminData = async (req: Request, res: Response,next:NextFunction) => {
  const { id } = req.params;
  try {
    const result = await adminServices.deleteAdmin(id);

    sendResponse(res,{
      statusCode:httpStatus.OK,
      success: true,
      message: "admin data deleted successfully",
      data: result,
    })
 
  } catch (err) {
   next(err)
  }
};

const softDeleteAdminData = async (req: Request, res: Response,next:NextFunction) => {
  const { id } = req.params;
  try {
    const result = await adminServices.softDeleteAdmin(id);
    sendResponse(res,{
      statusCode:httpStatus.OK,
      success: true,
      message: "soft admin data deleted successfully",
      data: result,
    })
  
  } catch (err) {
   next(err)
  }
};

export const adminControllers = {
  getAllADmins,
  getAdminById,
  updateAdminData,
  deleteAdminData,
  softDeleteAdminData,
};

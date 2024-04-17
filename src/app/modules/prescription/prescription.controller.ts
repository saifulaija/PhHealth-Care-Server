import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { prescriptionServices } from "./prescription.service";
import { IAuthUser } from "../../interfaces/common";
import { Request, Response } from "express";
import { pick } from "../../../shared/pick";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await prescriptionServices.insertIntoDB(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription created successfully",
      data: result,
    });
  }
);
const patientPrescription = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await prescriptionServices.patientPrescription(
      user as IAuthUser,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription fatched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const prescriptionControllers = {
  insertIntoDB,
  patientPrescription,
};

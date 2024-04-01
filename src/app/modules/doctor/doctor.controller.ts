import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorServices } from "./doctor.service";

const updateDoctor= catchAsync(async (req, res) => {
    const {id}=req.params
    const result = await doctorServices.updateDoctorIntoDB(id,req.body);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "doctor data updated successfully",
  
      data: result,
    });
  });


  export const doctorControllers={
    updateDoctor
  }
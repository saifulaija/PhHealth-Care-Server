
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { specialtiesServices } from "./specialties.service";

const createSpecialties = catchAsync(async (req, res) => {
   
    const result = await specialtiesServices.createSpecialtiesItToDB(req);
  
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "sepialties created successfully",
     
      data: result
    });
  });

  export const specialtiesControllers={
    createSpecialties
  }
  
  
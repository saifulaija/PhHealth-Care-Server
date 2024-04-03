import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { doctorServices } from "./doctor.service";
import { pick } from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constant";

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



  const getAllFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, doctorFilterableFields);

    console.log(filters)

    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await doctorServices.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Doctors retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});



  export const doctorControllers={
    updateDoctor,getAllFromDB
  }
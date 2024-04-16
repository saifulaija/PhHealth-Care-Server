import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { paymentServices } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;

  const result = await paymentServices.initPayment(appointmentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment init  successfully",

    data: result,
  });
});

const validatePayment = catchAsync(async (req, res) => {
  const result = await paymentServices.validatePayment(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment validate  successfully",
    data: result,
  });
});

export const paymentControllers = {
  initPayment,
  validatePayment,
};

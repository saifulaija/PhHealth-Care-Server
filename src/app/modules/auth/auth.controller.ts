import httpStatus from "http-status";

import { authServices } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "logged in successfully",
    data: {
      accessToken: result.accessToken,
      needsPasswordchange: result.needsPasswordChange,
    },
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "refreshToken create successfully",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;

    const result = await authServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "password changed successfully",
      data: result,
    });
  }
);

const forgetPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
     await authServices.forgetPassword(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "password send your mail successfully",
      data: null,
    });
  }
);


const resetPassword = catchAsync(async(req, res) => {

    const token = req.headers.authorization || "";

   await authServices.resetPassword(token, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "password reset successfully",
      data: null,
    });
  }
);

export const authControllers = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword
};

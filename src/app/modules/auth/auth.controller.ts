
import httpStatus from "http-status";

import { authServices } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";



const loginUser=catchAsync(async(req,res)=>{
    const result =await authServices.loginUser(req.body);
    const {refreshToken}=result;
    res.cookie('refreshToken',refreshToken,{
        secure:false,
        httpOnly:true
    });

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'logged in successfully',
        data:{
            accessToken:result.accessToken,
            needsPasswordchange:result.needsPasswordChange
        }
    })
});
const refreshToken=catchAsync(async(req,res)=>{
    const {refreshToken}=req.cookies
    const result =await authServices.refreshToken(refreshToken);
   

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'refreshToken create successfully',
        data:result
    })
});

export const authControllers={
    loginUser,
    refreshToken
}

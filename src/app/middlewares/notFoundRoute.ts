import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"

export const notFounRoute=(req:Request,res:Response,next:NextFunction)=>{
    res.status(httpStatus.NOT_FOUND).json({
        success:false,
        message:'API NOT FOUND',
        error:{
            path:req.originalUrl,
            message:'Your required path is not found'
        }
    })
}
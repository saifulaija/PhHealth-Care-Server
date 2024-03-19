import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async(req:Request, res:Response)=>{
    // console.log(req.body)
try {
    const result = await userServices.createAdmin(req.body)
res.status(200).json({
    success:true,
    message:'Admin created successfully',
    data:result
})
} catch (err) {
    res.status(500).json({
        success:false,
        message:err?.name ||'some thing went wrong',
        error:err
    })
}
}

export const userControllers={
    createAdmin
}
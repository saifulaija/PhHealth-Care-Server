import  bcrypt  from 'bcrypt';
import prisma from "../../../shared/prisma";
import {  jwtHelpers } from '../../../helpers/jwtHelpers';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserStatus } from '@prisma/client';




const loginUser =async (payload: { email: string; password: string }) => {
    
    const userData= await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    });

    const isCorrectPassword:boolean= await bcrypt.compare(payload.password,userData.password)
    console.log(isCorrectPassword)
    if(!isCorrectPassword){
        throw new Error("password is not correct")
    }
    const accessToken =jwtHelpers.generateToken({
      email:userData.email,
      role:userData.role
  },"abcdefg","5m")



    const refreshToken =jwtHelpers.generateToken({
      email:userData.email,
      role:userData.role
  },"abcdefghijkl","30d")

  
  

  return {
    accessToken,
    needsPasswordChange:userData.needPasswordChange,
    refreshToken
  }
};
const refreshToken =async (token:string) => {

  let decodedData;
 try {
   decodedData=jwtHelpers.verifyToken(token,'abcdefghijkl') 
  console.log(decodedData)
 } catch (err) {
  throw new Error("you are not authorized")
 }
    
    const userData=await prisma.user.findUniqueOrThrow({
      where:{
        email:decodedData?.email,
        status:UserStatus.ACTIVE
      }
    });

    const accessToken =jwtHelpers.generateToken({
      email:userData.email,
      role:userData.role
  },"abcdefg","5m")


    return {
      accessToken,
      needsPasswordChange:userData.needPasswordChange,
    }

};

export const authServices = {
  loginUser,
  refreshToken
};



import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Prisma, UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is not correct");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret_access_toten as Secret,
    config.jwt.expires_in_access_token as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret_refresh_token as Secret,
    config.jwt.expires_in_refresh_token as string
  );

  return {
    accessToken,
    needsPasswordChange: userData.needPasswordChange,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret_refresh_token as Secret
    );
    console.log(decodedData);
  } catch (err) {
    throw new Error("you are not authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret_access_toten as Secret,
    config.jwt.expires_in_access_token as string
  );

  return {
    accessToken,
    needsPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is not correct");
  }

  const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "password changed successfully",
  };
};

const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_token as Secret,
    config.jwt.reset_token_expires_in as string
  );

  //http://localhost:5555/reset-pass?email=sobuj@gmail.com=kjdhfjj forfortent access

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    `
    <div>
      <p>Dear User</p>
      <p>Your password reset link
      <a href=${resetPassLink}>
      <button>Reset Password</button>
      </a>
      </p>

    </div>
    `
  );

  console.log({ resetPassLink });
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  console.log({ token, payload });

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_token as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbiden");
  }

  //hash password
  const hashPassword: string = await bcrypt.hash(payload.password, 12);
  const result = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashPassword,
    },
  });

  console.log(isValidToken);
};

export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};

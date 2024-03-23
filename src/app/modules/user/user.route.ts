import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN,UserRole.SUPER_ADMIN), userControllers.createAdmin);

export const userRoutes = router;

import express, { Request, Response } from "express";

import { adminControllers } from "./admin.controller";

import { adminValidationsSchemas } from "./admin.validations";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.getAllADmins
);
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.getAdminById
);

router.patch(
  "/:id",

  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(adminValidationsSchemas.update),
  adminControllers.updateAdminData
);
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.softDeleteAdminData
);
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.deleteAdminData
);

export const adminRoutes = router;

import express, { Request, Response } from "express";

import { adminControllers } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminValidationsSchemas } from "./admin.validations";
const router = express.Router();
router.get("/", adminControllers.getAllADmins);
router.get("/:id", adminControllers.getAdminById);
router.patch(
  "/:id",
  validateRequest(adminValidationsSchemas.update),
  adminControllers.updateAdminData
);
router.delete("/soft/:id", adminControllers.softDeleteAdminData);
router.delete("/:id", adminControllers.deleteAdminData);

export const adminRoutes = router;

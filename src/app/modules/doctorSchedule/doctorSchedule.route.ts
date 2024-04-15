import express from "express";
import { doctorScheduleContrpllers } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();
router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  doctorScheduleContrpllers.getMySchedule
);
router.post("/", auth(UserRole.DOCTOR), doctorScheduleContrpllers.insertIntoDB);
router.delete('/:id',auth(UserRole.DOCTOR),doctorScheduleContrpllers.deleteFromDB)

export const doctorScheduleRoutes = router;

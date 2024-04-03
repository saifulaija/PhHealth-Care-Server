import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { adminRoutes } from "../modules/admin/admin.route";
import { authRoutes } from "../modules/auth/auth.route";
import { specialtiesRoutes } from "../modules/specialties/specialties.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.route";



const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/specialties",
    route: specialtiesRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: '/schedule',
    route: ScheduleRoutes
}
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

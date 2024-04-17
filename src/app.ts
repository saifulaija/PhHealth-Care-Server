import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cron from "node-cron";

import router from "./app/routes";
import httpStatus from "http-status";

import cookieParser from "cookie-parser";
import globalErrorhandler from "./app/middlewares/globalErrorHandler";
import notFounRoute from "./app/middlewares/notFoundRoute";
import { appoinmentServices } from "./app/modules/appoinment/appoinment.service";

const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("* * * * *", () => {
  try {
    appoinmentServices.cancelUnpaidAppointments();
  } catch (err) {
    console.error(err);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Ph health care server",
  });
});

app.use("/api/v1", router);
app.use(globalErrorhandler);

app.use(notFounRoute);

export default app;

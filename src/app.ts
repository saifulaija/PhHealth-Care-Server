import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

import router from "./app/routes";
import httpStatus from "http-status";
import { globalErrorhandler } from "./app/middlewares/globalErrorHandler";
import { notFounRoute } from "./app/middlewares/notFoundRoute";

const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Ph health care server",
  });
});

app.use("/api/v1", router);
app.use(globalErrorhandler);

app.use(notFounRoute)

export default app;

import express, { Request, Response } from "express";
import 'dotenv/config';
import cors from "cors";
import cookieParser from "cookie-parser";

import dropRoutes from "./app/modules/drop/drop.routes";
import reservationRoutes from "./app/modules/reservation/reservation.routes";
import purchaseRoutes from "./app/modules/purchase/purchase.routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";


const app = express();


app.use((req, res, next) => {
  const method = req.method.toUpperCase();
  const contentLength = req.headers["content-length"];
  const contentType = (req.headers["content-type"] || "").toLowerCase();


  if (method === "GET" || method === "HEAD") {
    req.body = {};
    return next();
  }

  if (contentLength === "0") {
    req.body = {};
    return next();
  }


  if (contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")) {
    return next();
  }


  if (!contentType) {
    req.body = {};
    return next();
  }


  if (contentType.includes("application/json")) {
    return express.json({ limit: "1mb" })(req, res, next);
  }

  return next();
});



app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// app.use(
//   cors({
//     origin:[ "http://localhost:3000","https://travel-planning-client.vercel.app"],
//     credentials: true,
//   })
// );


app.use("/api/drops", dropRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/purchases", purchaseRoutes);


app.use(globalErrorHandler);
app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Server");
});

export default app;

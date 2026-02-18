import { Server as HttpServer } from "http";
import http from "http";
import dotenv from "dotenv";
import { prisma } from "./app/config/db";
import app from "./app";
import { initSocket } from "./app/socket"; 
import { startExpirationJob } from "./app/jobs/expiration.job"; 

dotenv.config();

let server: HttpServer;

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("Database Connection Successful!!!!!!!!");
  } catch (error) {
    console.log("Database Connection Failed!!!!!!!!");
    console.log(error);
    process.exit(1);
  }
}
const startServer = async () => {
  try {
    await connectToDB();
    const httpServer = http.createServer(app);

    initSocket(httpServer);

  
       startExpirationJob();
const PORT = process.env.PORT || 5000;
    server = httpServer.listen(PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();


const shutdown = (signal: string, err?: unknown) => {
  console.log(`${signal} received... Server shutting down...`);

  if (err) {
    console.error(err);
  }

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (err) =>shutdown("Unhandled Rejection", err));
process.on("uncaughtException", (err) =>shutdown("Uncaught Exception", err));

import dotenv from "dotenv";
import config from "./config";
import { prisma } from "./config/prisma";


dotenv.config();

import app from "./app";
const PORT = config.port;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("error starting server:", err);
    await prisma.$disconnect();
    process.exit(1)
  }
};

startServer();
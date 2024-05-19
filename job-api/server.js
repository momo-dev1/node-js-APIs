import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// routers
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js";
// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// middleware
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import { authenticateUser } from "./middleware/authentication.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v2/jobs", authenticateUser, jobRouter);
app.use("/api/v2/users", authenticateUser, userRouter);
app.use("/api/v2/auth", authRouter);

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist','index.html'));
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5500;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

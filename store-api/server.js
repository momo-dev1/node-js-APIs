import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import productsRouter from './routes/products';

import { globalError } from './middleware/errorMiddleware';

// routers
import productRouter from "./routes/productRouter.js";

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// routes
app.use('/api/v1/products', productRouter)

app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
  });

app.use(globalError);

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

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
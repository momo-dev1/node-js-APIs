require('dotenv').config()
require('express-async-errors');

const chalk = require('chalk')
const express = require("express")
const app = express();

const productsRouter = require('./routes/products');
const connectDB = require('./db/connect');

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
import { globalError } from './middleware/errorMiddleware';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// routes
app.use('/api/v1/products', productsRouter)
app.use(notFound)
app.use(errorHandlerMiddleware)


app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
  });

app.use(globalError);

const PORT = process.env.PORT || 5500;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
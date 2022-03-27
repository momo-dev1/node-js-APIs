require('dotenv').config()
require('express-async-errors');

const chalk = require('chalk')
const express = require("express")
const app = express();

const productsRouter = require('./routes/products');
const connectDB = require('./db/connect');

const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

// routes
app.use('/api/v1/products', productsRouter)
app.use(notFound)
app.use(errorHandlerMiddleware)



const port = process.env.DB_CONNECT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server is listening on port ${ chalk.yellowBright(port) }`)
        })
    } catch (err) {
        console.log(err)
    }
}

start();
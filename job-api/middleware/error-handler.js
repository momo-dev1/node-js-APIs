const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong',
  }
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message })
  }
  if (err.code && err.code === '11000') {
    customError.message = `this ${ Object.keys(err.keyValue) } already exists please try another one`
    customError.statusCode = 400
  }
  if (err.name === 'ValidationError') {
    customError.message = object.values(err.errors).map(e => e.message).join('& ')
  }
  return res.status(customError.statusCode).json({ message: customError.message })

}

module.exports = errorHandlerMiddleware

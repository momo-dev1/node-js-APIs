import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./custom-api.js";

export class UnAuthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

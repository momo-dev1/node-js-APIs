import { Schema, model, Types } from "mongoose";
import { JOB_POSITION, JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
const JobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a position"],
      enum: Object.values(JOB_POSITION),
      maxlength: 100,
    },
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    location: {
      type: String,
      default: "my city",
    },
    skills: {
      type: [String],
      required: [true, "Please provide skills"],
      default: [],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    avatarColor: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("Job", JobSchema);

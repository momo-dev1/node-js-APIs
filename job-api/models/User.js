import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a name"],
    unique: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username must be at most 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters"],
  },
  location: {
    type: String,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username must be at most 20 characters"],
    default: "my location",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}
export default model("User", UserSchema);

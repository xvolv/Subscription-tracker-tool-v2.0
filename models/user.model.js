import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "USER NAME IS REQUIRED"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      unique: [true, "EMAIL ALREADY EXIST"],
      required: [true, "USER EMAIL IS REQUIRED"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "PLEASE FILL A VALID EMAIL ADDRESS",
      ],
    },
    password: {
      type: String,
      required: [true, "USER password IS REQUIRED"],
      minLength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

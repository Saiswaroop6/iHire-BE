import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    ssn: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

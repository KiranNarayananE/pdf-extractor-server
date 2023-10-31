import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  files: [
    {
      originalFileName: {
        type: String,
      },
      originalFileData: {
        type: Buffer,
      },
      modifiedFileName: {
        type: String,
      },
      modifiedFileData: {
        type: Buffer,
      },
    },
  ],
});

const userModel = mongoose.model("user", userSchema);
export default userModel;

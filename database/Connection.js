import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import * as dotenv from "dotenv"
dotenv.config();
const url =process.env.url
const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export default connectDB;
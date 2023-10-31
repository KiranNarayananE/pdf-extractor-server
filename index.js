import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/Connection.js";
import userRoutes from "./router/user.js";



//*  CONFIGURATION *//
const app = express();
app.use(morgan("dev"))
const PORT = process.env.PORT || 6001;


app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

//*  ROUTES   *//

app.use("/", userRoutes);


//*  Databases *//
connectDB();
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
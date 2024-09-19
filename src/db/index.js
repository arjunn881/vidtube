import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log(`${process.env.MONGO_DB}/${DB_NAME}`)
    await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`);
    
    console.log(
      `\n MongoDB connected ! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB CONNECTION ERROR !!!", error);
    process.exit(1);
  }
};

export default connectDB;

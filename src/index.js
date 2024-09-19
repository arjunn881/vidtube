import { app } from "./app.js";
import  dotenv  from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path:"./.env"
})


const PORT = process.env.PORT ||5000;

console.log(process.env.PORT)

connectDB()
.then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
  });
}).catch((error)=>{
  console.log("MongoDB connection error!!!", error )
})


 


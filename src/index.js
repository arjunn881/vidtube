import  dotenv  from "dotenv";
// import 'dotenv/config'
import { app } from "./app.js";

import connectDB from "./db/index.js";



dotenv.config({
    path:"./.env"
})


const PORT = process.env.PORT ||5001;

// -r dotenv/config --experimental-json-modules

connectDB()
.then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
  });
}).catch((error)=>{
  console.log("MongoDB connection error!!!", error )
})


 


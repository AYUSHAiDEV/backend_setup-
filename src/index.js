// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js";
import {app} from "./app.js";
import {connectDB} from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
    path:'./env'
});
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`SERVER STARTED ON PORT ${process.env.PORT || 8000}`)
    })
})
.catch((error)=>{
console.error("Error starting the server:", error);
})
// (async function connectDB(){
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//          console.log("Connected to MongoDB successfully");
//          app.on("error", (error) => {
//             console.error("Error starting the server:", error);
//             throw error;
//          });
//          app.listen(process.env.PORT, ()=>{
//             console.log(`Server is running on port ${process.env.PORT}`);
//          })
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         throw error;
//     }
// })();


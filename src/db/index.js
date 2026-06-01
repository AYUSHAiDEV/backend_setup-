import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
const connectDB =async()=>{
    try {
        const MONGODB_URI = process.env.MONGODB_URI ;
        const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to MongoDB successfully");
        console.log(`Server is running on port ${process.env.PORT}`)
        console.log(`Connected to MongoDB at ${connectionInstance.connection.host}`, `on port ${connectionInstance.connection.port}`, `with database name ${connectionInstance.connection.name}`);
    }catch (error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
export { connectDB };
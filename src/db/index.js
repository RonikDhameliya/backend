import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

async function dbConnection(){
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`mongoDB connected at ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default dbConnection;
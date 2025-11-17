import dbConnection from "./db/index.js";
import dotenv from 'dotenv';
import { app } from "./app.js";


dotenv.config({
    path : '../env'
})

const port = process.env.PORT || 5000
dbConnection()
.then(()=>{
    app.listen(port, ()=>{
        console.log('⚙️ server is running on Port : ', port);
    })
})
.catch((err)=>{
        console.log('mongoDB connection failed', err);
    })

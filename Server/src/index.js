import 'dotenv/config';
import connectDB from './db/index.js';
import { app } from './app.js';

connectDB()
.then(()=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log(`port on : ${process.env.PORT || 3000}`);
    })
    app.on("error",(error)=>{
        console.error("Error starting the server:", error);
    })
})
    

.catch((error)=>{
    console.log("Error connecting to the database:", error);
})


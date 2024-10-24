import express from "express";

import { connectDB } from "./utils/features.js" ;
import dotenv from 'dotenv';
import e from "express";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoute from './routes/user.js';
import chatRoute from './routes/chat.js';
import { createMessagesInChat } from "./seeders/chat.js";

dotenv.config({
   path:"./.env",
});


// const server= new createServer(app); 
const mongoURI = process.env.MONGO_URI;
const port =process.env.PORT || 3000;

connectDB(mongoURI);

//createMessagesInChat("670e7beb3c79cfd7343d81fa",50);
// createSingleChats(10);
// createGroupChats(10);
//createUser(10);

const app= express();
// Using middleware  here
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());


app.use("/user",userRoute);
app.use("/chat",chatRoute);

app.get( "/" , (req, res)=>{
    res.send("Hello World!");
}); 

app.use(errorMiddleware);

app.listen(port, ( ) => {
    console. log(`Server is running on ${port}` );
});

 
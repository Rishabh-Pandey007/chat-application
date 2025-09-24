import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from 'dotenv';
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import the cors package
import userRoute from './routes/user.js';
import chatRoute from './routes/chat.js';
import { createMessagesInChat } from "./seeders/chat.js";
import { Server } from 'socket.io';
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator} from './middlewares/auth.js'

dotenv.config({
    path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const userSocketIDs = new Map();

connectDB(mongoURI);

const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: corsOptions
});

app.set('io', io);

// Using CORS middleware
app.use(cors({
    credentials: true,
    origin:true
  }));

// Using other middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/chat", chatRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

io.use((socket, next)=>{
    cookieParser()(
        socket.request,
        socket.request.res,
        async(err) => await socketAuthenticator(err, socket, next)
        );
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import dotenv from 'dotenv'
import mongoose from 'mongoose'

const app = express();
app.use(express.json());

dotenv.config();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);




mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Connection error", err);
  });

app.listen(8800, () => {
  console.log("Server is running!");
});

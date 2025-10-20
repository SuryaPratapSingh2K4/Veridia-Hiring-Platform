import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
import userRouter from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("API is running...");
// });

app.use("/api/user", userRouter);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
});

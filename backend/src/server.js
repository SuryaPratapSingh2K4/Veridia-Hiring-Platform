import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
import userRouter from "./routes/userRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("API is running...");
// });

app.use("/api/user", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/application", applicationRouter);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
});

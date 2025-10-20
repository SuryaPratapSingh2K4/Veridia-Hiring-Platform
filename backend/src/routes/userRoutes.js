import express from "express";
import { Login, SignUp } from "../controller/userController.js";

const router = express.Router();

router.post("/login", Login);

router.post("/signup", SignUp);

export default router;

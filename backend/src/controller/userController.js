import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

export const createToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET, {
        expiresIn: "3d",
    });
};

export async function Login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        res.status(400).json({ message: "Email and Password are required" });
        return;
        }
        const existingUser = await User.findOne({ email });
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
        res.status(404).json({ message: "User not found" });
        return;
        }
        const token = createToken(existingUser);
        return res.status(200).json({ user: existingUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function SignUp(req, res) {

    try {
        const { name, email, password, role } = req.body;
        if (!email || !password || !name || !role) {
        return res.status(400).json({ message: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }
        if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Password is not strong enough" });
        }
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        });
        await newUser.save();
        const token = createToken(newUser);
        return res
        .status(201)
        .json({
            message: "Account registered successfully",
            user: newUser,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

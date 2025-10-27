import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { AuthRequest } from "../../shared/middlewares/auth";
import { validatePassword } from "../../shared/utils/validators";
import User from "./User";

export class AuthController {
    static async login(req: AuthRequest, res: Response) {
        try {
            const jwtSecret = process.env.JWT_SECRET;

            if (!jwtSecret) {
                console.error("JWT_SECRET is not defined in environment variables");
                return res.status(500).json({ message: "Internal server error" });
            }

            const { email, password } = req.body;

            if(!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            if (!user.activated) {
                return res.status(403).json({ message: "User is not activated" });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            user.last_login = new Date();
            await user.save();

            const token = jwt.sign(
                { id: user._id, role: user.role, email: user.email, name: user.name, activated: user.activated },
                jwtSecret,
                { expiresIn: "1h" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                // secure: true,
                secure: false,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000,
            });

            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    company: user.company,
                    role: user.role,
                    last_login: user.last_login,
                },
            });

        } catch (error) {
            res.status(500).json({ message: "Failed to log in user" });
        }
    }

    static async logout(req: AuthRequest, res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.status(204).send();
    }

    static async register(req: AuthRequest, res: Response) {
        try {
            const { name, email, company, role, password } = req.body;

            // Prevent duplicate emails
            const exists = await User.findOne({ email });
            if (exists) {
                return res.status(409).json({ message: "Email already registered" });
            }

            if(!validatePassword(password)) {
                return res.status(400).json({ 
                    message: "Password must be 8-20 characters long, include at least one letter, one number, and one special character (.-_/;,)" 
                });
            }

            // Create user with virtual password setter
            const user = await User.create({
                name,
                email,
                company,
                role,
                password,
                created_at: new Date(),
                activated: false,
            });

            await user.save();

            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    company: user.company,
                    role: user.role,
                },
            });

        } catch (error: any) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Failed to register user" });
        }
    }
}

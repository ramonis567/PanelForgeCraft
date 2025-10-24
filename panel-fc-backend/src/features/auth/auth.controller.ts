import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { ENV } from "../../shared/config/env";
import User from "./User";

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if(!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            if (!user.activated) {
                return res.status(403).json({ message: "Account not activated" });
            }

            user.last_login = new Date();
            await user.save();

            const token = jwt.sign(
                { id: user._id, role: user.role, email: user.email, name: user.name },
                process.env.JWT_SECRET as Secret,
                { expiresIn: ENV.TOKEN_EXPIRATION || "1d" }
            );

        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ message: "Failed to log in user" });
        }
    }

    static async register(req: Request, res: Response) {
        try {
            const { name, email, company, role, password } = req.body;

            // Prevent duplicate emails
            const exists = await User.findOne({ email });
            if (exists) {
                return res.status(409).json({ message: "Email already registered" });
            }

            // Create user with virtual password setter
            const user = await User.create({
                name,
                email,
                company,
                role,
                password_hash: "tmp", // will be replaced by virtual
                password,
                created_at: new Date(),
                activated: false,
            });

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

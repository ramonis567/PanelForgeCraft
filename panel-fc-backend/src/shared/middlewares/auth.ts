import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ENV } from "../config/env";
import { time } from "console";

export interface AuthUserPayload extends JwtPayload {
  id: string;
  role: string;
  email: string;
  name: string;
  activated?: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, ENV.JWT_SECRET as Secret) as AuthUserPayload;
        if (decoded.activated === false) {
            return res.status(403).json({ message: "User not activated" });
        }

        const exp = (decoded as any).exp * 1000;
        const timeLeft = exp - Date.now();
        if(timeLeft < 15 * 60 * 1000) {
            const newToken = jwt.sign(
                { id: decoded.id, role: decoded.role, email: decoded.email, name: decoded.name, activated: decoded.activated },
                ENV.JWT_SECRET as Secret,
                { expiresIn: "1h" }
            );
            res.cookie("token", newToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000,
            });
        }

        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired session" });
    }
};

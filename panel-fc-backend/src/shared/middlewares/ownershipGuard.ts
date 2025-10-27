import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import Panel from "../../features/panels/Panel"; // adjust if your path differs

export const requireOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const panel = await Panel.findById(id).select("metadata.createdBy");
        if (!panel) return res.status(404).json({ message: "Panel not found" });

        const ownerId = panel.metadata?.createdBy?.toString();
        const userId = req.user?.id;

        if (!userId || ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        return next();
    } catch (err) {
        return res.status(500).json({ message: "Ownership check failed" });
    }
};

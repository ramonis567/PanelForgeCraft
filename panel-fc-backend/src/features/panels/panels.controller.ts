import { Response } from "express";
import { PanelService } from "./panels.services";
import { AuthRequest } from "../../shared/middlewares/auth";

export class PanelController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const panels = await PanelService.getAllByOwner(userId);
      return res.status(200).json(panels);
    } catch (error) {
      console.error("Error fetching panels:", error);
      return res.status(500).json({ message: "Failed to fetch panels" });
    }
  }

  /** Return a single panel (ownership already checked by middleware) */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const panel = await PanelService.getById(req.params.id);
      if (!panel) return res.status(404).json({ message: "Panel not found" });
      return res.status(200).json(panel);
    } catch (error) {
      console.error("Error fetching panel:", error);
      return res.status(500).json({ message: "Failed to fetch panel" });
    }
  }

  /** Create a new panel for the authenticated user */
  static async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const panel = await PanelService.create({
        ...req.body,
        metadata: {
          ...(req.body.metadata || {}),
          createdBy: userId,
          createdAt: new Date(),
          lastModifiedAt: new Date(),
        },
      });

      return res.status(201).json(panel);
    } catch (error) {
      console.error("Error creating panel:", error);
      return res.status(500).json({ message: "Failed to create panel" });
    }
  }

  /** Update an owned panel (ownership already checked) */
  static async update(req: AuthRequest, res: Response) {
    try {
      const updated = await PanelService.update(req.params.id, {
        ...req.body,
        "metadata.lastModifiedAt": new Date(),
      });
      if (!updated) return res.status(404).json({ message: "Panel not found" });
      return res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating panel:", error);
      return res.status(500).json({ message: "Failed to update panel" });
    }
  }

  /** Delete an owned panel (ownership already checked) */
  static async delete(req: AuthRequest, res: Response) {
    try {
      const deleted = await PanelService.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Panel not found" });
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting panel:", error);
      return res.status(500).json({ message: "Failed to delete panel" });
    }
  }
}

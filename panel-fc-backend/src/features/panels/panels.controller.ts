import { Request, Response } from "express";
import { PanelService } from "./panels.services";

export class PanelController {
  static async getAll(req: Request, res: Response) {
    const panels = await PanelService.getAll();
    res.status(200).json(panels);
  }

  static async getById(req: Request, res: Response) {
    const panel = await PanelService.getById(req.params.id);
    if (!panel) return res.status(404).json({ message: "Panel not found" });
    res.status(200).json(panel);
  }

  static async create(req: Request, res: Response) {
    const panel = await PanelService.create(req.body);
    res.status(201).json(panel);
  }

  static async update(req: Request, res: Response) {
    const updated = await PanelService.update(req.params.id, req.body);
    res.status(200).json(updated);
  }

  static async delete(req: Request, res: Response) {
    await PanelService.delete(req.params.id);
    res.status(204).send();
  }
}

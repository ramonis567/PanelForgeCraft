import { Request, Response } from "express";
import { CatalogService } from "../services/catalog.services";

export class CatalogController {
    static async getAll(req: Request, res: Response) {
        try {
            const catalog = await CatalogService.getAll(req.query);
            res.status(200).json(catalog);
        } catch (error) {
            console.error("Error fetching catalog:", error);
            res.status(500).json({ message: "Failed to fetch catalog" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await CatalogService.getById(id);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).json({ message: "Failed to fetch product" });
        }
    }
}

import { Router } from "express";
import { CatalogController } from "../controllers/catalog.controller";

const router = Router();

router.get("/", CatalogController.getAll);
router.get("/:id", CatalogController.getById);

export default router;
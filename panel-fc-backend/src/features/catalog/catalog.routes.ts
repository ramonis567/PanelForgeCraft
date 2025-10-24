import { Router } from "express";
import { CatalogController } from "./catalog.controller";

const router = Router();

router.get("/", CatalogController.getAll);
router.get("/:id", CatalogController.getById);

export default router;
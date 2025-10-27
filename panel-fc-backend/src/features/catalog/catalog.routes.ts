import { Router } from "express";
import { CatalogController } from "./catalog.controller";
import { authenticate } from "../../shared/middlewares/auth";

const router = Router();

router.use(authenticate);
router.get("/", CatalogController.getAll);
router.get("/:id", CatalogController.getById);

export default router;
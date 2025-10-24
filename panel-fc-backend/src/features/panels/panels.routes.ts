import { Router } from "express";
import { PanelController } from "./panels.controller";

const router = Router();

router.get("/", PanelController.getAll);
router.get("/:id", PanelController.getById);
router.post("/", PanelController.create);
router.put("/:id", PanelController.update);
router.delete("/:id", PanelController.delete);

export default router;

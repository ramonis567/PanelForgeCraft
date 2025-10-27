import { Router } from "express";
import { PanelController } from "./panels.controller";
import { authenticate } from "../../shared/middlewares/auth";
import { requireOwner } from "../../shared/middlewares/ownershipGuard";

const router = Router();

router.use(authenticate);

router.get("/", PanelController.getAll);
router.post("/", PanelController.create);

router.route("/:id")
.get(requireOwner, PanelController.getById)
.put(requireOwner, PanelController.update)
.delete(requireOwner, PanelController.delete);

export default router;

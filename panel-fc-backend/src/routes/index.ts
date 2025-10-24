import { Router } from 'express';
import catalogRoutes from './catalog.routes';

const router = Router();

router.use('/catalog', catalogRoutes);
router.get("/health", (_req, res) => {
    res.status(200).json({ status: "Ok" });
});

export default router;
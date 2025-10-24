import { Router } from 'express';
import authRoutes from '../../features/auth/auth.routes';
import catalogRoutes from '../../features/catalog/catalog.routes';
import panelRoutes from '../../features/panels/panels.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/catalog', catalogRoutes);
router.use("/panels", panelRoutes);

router.get("/health", (_req, res) => {
    res.status(200).json({ status: "Ok" });
});

export default router;
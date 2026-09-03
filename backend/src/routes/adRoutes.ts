import { Router } from "express";
import * as adController from "../controllers/adController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/ads', adController.getActiveAds);
router.get('/ads/:id', adController.getAdById);

router.post('/ads', authMiddleware, adController.createAd);
router.put("/ads/:id", authMiddleware, adController.updateAd);
router.delete("/ads/:id", authMiddleware, adController.deleteAd);

export default router;
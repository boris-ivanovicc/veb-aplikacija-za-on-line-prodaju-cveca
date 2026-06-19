import { Router } from "express";
import * as adController from "../controllers/adController";

const router = Router();

router.get('/ads', adController.getActiveAds);
router.get('/ads/:id', adController.getAdById);
router.post('/ads', adController.createAd);
router.put("/ads/:id", adController.updateAd);
router.delete("/ads/:id", adController.deleteAd);

export default router;
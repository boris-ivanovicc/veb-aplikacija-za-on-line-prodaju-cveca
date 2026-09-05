import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as cartController from "../controllers/cartController";

const router = Router();

router.get("/", authMiddleware, cartController.getCart);
router.get("/purchases", authMiddleware, cartController.getPurchases);
router.post("/add", authMiddleware, cartController.addToCart);
router.post("/checkout", authMiddleware, cartController.handleCheckout);
router.delete("/item/:itemId", authMiddleware, cartController.removeItem);

export default router;
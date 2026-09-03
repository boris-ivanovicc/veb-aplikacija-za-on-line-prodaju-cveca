import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as cartController from "../controllers/cartController";

console.log('--- CART CONTROLLER IMPORTS ---');
console.log('getCart:', typeof cartController.getCart);
console.log('addToCart:', typeof cartController.addToCart);
console.log('handleCheckout:', typeof cartController.handleCheckout);
console.log('-------------------------------');

const router = Router();

router.get("/", authMiddleware, cartController.getCart);
router.get("/purchases", authMiddleware, cartController.getPurchases);
router.post("/add", authMiddleware, cartController.addToCart);
router.post("/checkout", authMiddleware, cartController.handleCheckout);
router.delete("/item/:itemId", authMiddleware, cartController.removeItem);

export default router;
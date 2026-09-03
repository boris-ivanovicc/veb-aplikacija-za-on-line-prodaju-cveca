import "reflect-metadata";
import express from "express";
import adRoutes from "./adRoutes";
import userRoutes from "./userRoutes";
import cartRoutes from "./cartRoutes";

const router = express.Router();

router.use("/", adRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);

export default router;
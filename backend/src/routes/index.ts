import "reflect-metadata";
import express from "express";
import adRoutes from "./adRoutes";
import userRoutes from "./userRoutes";

const router = express.Router();

router.use("/store", adRoutes);
router.use("/users", userRoutes);

export default router;
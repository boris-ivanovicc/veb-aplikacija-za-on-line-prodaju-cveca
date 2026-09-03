import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  getProfile
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRoutes = Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/refresh", refreshUserToken);

userRoutes.get("/self", authMiddleware, getProfile);

export default userRoutes;
import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  getProfile
} from "../controllers/userController";  

export const userRoutes = Router();


userRoutes.post("/user/register", registerUser);
userRoutes.post("/user/login", loginUser);
userRoutes.post("/user/refresh", refreshUserToken);
userRoutes.get("/user/self", getProfile);
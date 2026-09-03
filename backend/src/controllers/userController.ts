import { Request, Response } from "express";
import {
  register,
  login,
  refreshToken,
  getUserById,
} from "../services/userService";
import { AuthRequest } from "../middleware/authMiddleware";

const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await register(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.display_name
    );

    res.status(201).json({ success: true, data: user });
  } catch (e: any) {
    const error = e.message === "USER_ALREADY_EXISTS"
      ? "Username or email already exists"
      : e.message || "Registration failed";

    res.status(400).json({ success: false, error });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await login(req.body.username, req.body.password);
    res.json({ success: true, data: result });
  } catch (e: any) {
    let errorMessage = "Login failed";

    if (e.message === "INCORRECT_USERNAME_OR_PASSWORD") {
      errorMessage = "Incorrect username or password";
    } else if (e.message) {
      errorMessage = e.message;
    }

    res.status(401).json({
      success: false,
      error: errorMessage
    });
  }
};

const refreshUserToken = async (req: Request, res: Response) => {
  try {
    const result = await refreshToken(req.body.refresh);
    res.json({ success: true, data: result });
  } catch (e: any) {
    res.status(403).json({ success: false, error: e.message || "Refresh failed" });
  }
};

const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getUserById(req.user!.id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (e: any) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export { registerUser, loginUser, refreshUserToken, getProfile };
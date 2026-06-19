import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  register,
  login,
  refreshToken,
  getUserById,
} from "../services/userService";

const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await register(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.display_name
    );

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (e: any) {
    let message = "Registration failed";
    if (e.message === "USER_ALREADY_EXISTS") {
      message = "Username or email already exists";
    } else if (e.message) {
      message = e.message;
    }
    res.status(400).json({
      success: false,
      message: message,
    });
  }
};

const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await login(
      req.body.username,
      req.body.password
    );

    res.json({
      success: true,
      data: result
    });
  } catch (e: any) {
    let message = "Login failed";
    if (e.message === "INCORRECT_USERNAME_OR_PASSWORD") {
      message = "Incorrect username or password";
    } else if (e.message) {
      message = e.message;
    }
    res.status(401).json({
      success: false,
      message: message,
    });
  }
};

const refreshUserToken = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await refreshToken(
      req.body.refresh
    );

    res.json({
      success: true,
      data: result
    });
  } catch (e: any) {
    res.status(403).json({
      success: false,
      message: e.message || "Refresh failed",
    });
  }
};

const getProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      String(process.env.JWT_KEY)
    ) as {
      id: number;
    };

    const user = await getUserById(decoded.id);

    res.json({
      success: true,
      data: user
    });
  } catch (e: any) {
    res.status(401).json({
      success: false,
      message: e.message || "Invalid token",
    });
  }
};

export {
  registerUser,
  loginUser,
  refreshUserToken,
  getProfile,
};
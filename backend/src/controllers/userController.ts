import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  register,
  login,
  refreshToken,
  getUserById
} from "../services/userService.js";


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

    res.status(201).json(user);

  } catch (e: any) {

    res.status(400).json({
      message: e.message
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

    res.json(result);

  } catch (e: any) {

    res.status(401).json({
      message: e.message
    });

  }
};



const refreshUserToken = async (
  req: Request,
  res: Response
) => {

  try {

    const result =
      await refreshToken(
        req.body.refresh
      );

    res.json(result);

  } catch (e: any) {

    res.status(403).json({
      message: e.message
    });

  }
};



const getProfile = async (
  req: Request,
  res: Response
) => {

  try {

    
    const token =
      req.headers.authorization?.split(" ")[1];


    if (!token) {

      return res.status(401).json({
        message: "No token provided"
      });

    }


    const decoded = jwt.verify(
      token,
      String(process.env.JWT_KEY)
    ) as {
      id: number;
    };



    const user =
      await getUserById(
        decoded.id
      );


    res.json(user);


  } catch (e: any) {

    res.status(401).json({
      message: e.message
    });

  }
};



export {
  registerUser,
  loginUser,
  refreshUserToken,
  getProfile
};
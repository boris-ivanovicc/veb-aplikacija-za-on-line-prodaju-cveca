import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { AppDataSource } from "../config/dataSource";
import { Users } from "../entities/users";

dotenv.config();

const JWT_KEY = String(process.env.JWT_KEY);

const userRepo = AppDataSource.getRepository(Users);


const getUserById = async (id: number) => {
  return userRepo.findOneOrFail({
    where: { id },
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
};


const getUserByUsername = async (username: string) => {
  return userRepo.findOne({
    where: { username },
  });
};


const register = async (
  username: string,
  email: string,
  password: string,
  displayName?: string
) => {
  const existingUser = await userRepo.findOne({
    where: [{ username }, { email }],
  });

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = userRepo.create({
    username,
    email,
    displayName: displayName ?? null,
    passwordHash,
  });

  await userRepo.save(user);

  return getUserById(user.id);
};


const login = async (username: string, password: string) => {
  const user = await getUserByUsername(username);

  if (!user) {
    throw new Error("INCORRECT_USERNAME_OR_PASSWORD");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!validPassword) {
    throw new Error("INCORRECT_USERNAME_OR_PASSWORD");
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  return {
    access: jwt.sign(payload, JWT_KEY, { expiresIn: "30m" }),
    refresh: jwt.sign(payload, JWT_KEY, { expiresIn: "8d" }),
  };
};


const refreshToken = async (refresh: string) => {
  try {
    const decoded = jwt.verify(refresh, JWT_KEY) as any;

    const payload = {
      id: decoded.id,
      username: decoded.username,
    };

    return {
      access: jwt.sign(payload, JWT_KEY, { expiresIn: "30m" }),
      refresh,
    };
  } catch {
    throw new Error("REFRESH_FAILED");
  }
};

export {
  getUserById,
  getUserByUsername,
  register,
  login,
  refreshToken,
};
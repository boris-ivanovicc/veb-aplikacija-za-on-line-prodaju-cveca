import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../db.js";

dotenv.config();

const JWT_KEY = String(process.env.JWT_KEY);
const getUserById = async (id: number) => {
  return prisma.users.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      username: true,
      display_name: true,
      email: true,
      avatar_url: true,
      created_at: true
    }
  });
};

const getUserByUsername = async (username: string) => {
  return prisma.users.findUniqueOrThrow({
    where: {
      username
    }
  });
};

const register = async (
  username: string,
  email: string,
  password: string,
  display_name?: string
) => {

  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [
        { username },
        { email }
      ]
    }
  });

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      username,
      email,
      display_name,
      password_hash
    }
  });

  return getUserById(user.id);
};

const login = async (
  username: string,
  password: string
) => {

  const user = await getUserByUsername(username);

  const validPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!validPassword) {
    throw new Error("INCORRECT_USERNAME_OR_PASSWORD");
  }

  const payload = {
    id: user.id,
    username: user.username
  };

  return {
    access: jwt.sign(
      payload,
      JWT_KEY,
      { expiresIn: "30m" }
    ),

    refresh: jwt.sign(
      payload,
      JWT_KEY,
      { expiresIn: "8d" }
    )
  };
};

const refreshToken = async (
  refresh: string
) => {

  try {

    const decoded: any =
      jwt.verify(refresh, JWT_KEY);

    const payload = {
      id: decoded.id,
      username: decoded.username
    };

    return {
      access: jwt.sign(
        payload,
        JWT_KEY,
        { expiresIn: "30m" }
      ),
      refresh
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
  refreshToken
};
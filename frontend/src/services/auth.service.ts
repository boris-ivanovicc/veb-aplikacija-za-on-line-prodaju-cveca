import type { AuthModel } from "@/models/auth.model"

const AUTH_KEY = "flower_shop_auth";

export class AuthService {

  static saveAuth(auth: AuthModel) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }

  static hasAuth() {
    return localStorage.getItem(AUTH_KEY) !== null;
  }

  static removeAuth() {
    localStorage.removeItem(AUTH_KEY);
  }

  static getAuth(): AuthModel | null {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  }

  static getAccessToken() {
    return this.getAuth()?.access ?? "";
  }

  static getRefreshToken() {
    return this.getAuth()?.refresh ?? "";
  }
}
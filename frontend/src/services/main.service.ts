import axios from "axios";
import { AuthService } from "./auth.service";

const client = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  validateStatus: (status) => status >= 200 && status < 300
});

client.interceptors.request.use((config) => {
  let token = null;

  if (typeof AuthService?.getAccessToken === "function") {
    token = AuthService.getAccessToken();
  }

  if (!token) {
    const rawAuth = localStorage.getItem("flower_shop_auth");
    if (rawAuth) {
      try {
        const parsed = JSON.parse(rawAuth);
        token = parsed.access || parsed.token;
      } catch {
        token = rawAuth;
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export class MainService {

  static login(username: string, password: string) {
    return client.post("/users/login", { 
      username,
      password
    });
  }

  static register(
    username: string,
    email: string,
    password: string,
    display_name: string
  ) {
    console.log('Frontend sending:', { username, email, display_name });
    return client.post("/users/register", { 
      username,
      email,
      password,
      display_name
    });
  }

  static async useAxios(
    url: string,
    method: "get" | "post" | "put" | "delete" = "get",
    body: object = {}
  ) {
    try {
      return await client.request({
        url,
        method,
        data: body
      });
    } catch (e: any) {
      throw e;
    }
  }

  static getAdById(adId: number | string) {
    return client.get(`/ads/${adId}`);
  }

  static getAds() {
    return client.get('/ads');
  }

  static async createAd(adData: object) {
    console.log("Sending to backend:", JSON.stringify(adData, null, 2));
    return await client.post("/ads", adData);
  }

  static updateAd(adId: number, adData: object) {
    return client.put(`/ads/${adId}`, adData);
  }

  static deleteAd(adId: number) {
    return client.delete(`/ads/${adId}`);
  }
}
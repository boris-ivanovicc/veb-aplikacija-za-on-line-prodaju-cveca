import axios from "axios";
import { AuthService } from "./auth.service";

const client = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    Accept: "application/json"
  },
  validateStatus: (status) => status >= 200 && status < 300
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
    let rsp;

    try {
      const token = AuthService.getAccessToken();

      rsp = await client.request({
        url,
        method,
        data: body,
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

    } catch (e: any) {
      throw e;
    }

    return rsp;
  }

  static getAdById(adId: number | string) {
    return client.get(`/ads/${adId}`);
  }

  static getAds() {
    return client.get('/ads');
  }

  static async createAd(adData: object) {
    const token = AuthService.getAccessToken();
    console.log("Sending to backend:", JSON.stringify(adData, null, 2));

    return await client.post("/ads", adData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json"
      }
    });
  }

  static updateAd(adId: number, adData: object) {
    return client.put(`/ads/${adId}`, adData);
  }

  static deleteAd(adId: number) {
    return client.delete(`/ads/${adId}`);
  }
}
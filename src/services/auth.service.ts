import type { AxiosInstance } from "axios";
import httpClient from "../api/HttpClient";
import type { UserAttributes } from "../models/interfaces";

const authApiUrl = import.meta.env.VITE_AUTH_API_URL;

export class AuthService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = httpClient.create({ baseURL: authApiUrl });
  }

  public async getCurrentUser(): Promise<UserAttributes> {
    const result = await this.http.get("/auth/me");
    return result.data;
  }
}

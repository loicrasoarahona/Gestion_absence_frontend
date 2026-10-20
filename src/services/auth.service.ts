import type { AxiosInstance } from "axios";
import { createHttpClient } from "../api/HttpClient";
import type { UserAttributes } from "../models/interfaces";

const authApiUrl = import.meta.env.VITE_AUTH_API_URL;

export class AuthService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = createHttpClient(authApiUrl);
  }

  public async getCurrentUser(): Promise<UserAttributes> {
    const result = await this.http.get("/auth/me");
    return result.data;
  }

  public async login(email: string, password: string): Promise<void> {
    const { token } = (
      await this.http.post<{ token: string }>("/auth/login", {
        email,
        password,
      })
    ).data;
    localStorage.setItem("jwtoken", token);
  }

  public logout(): void {
    localStorage.removeItem("jwtoken");
  }
}

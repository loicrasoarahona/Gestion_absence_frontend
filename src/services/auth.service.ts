import type { AxiosInstance } from "axios";
import httpClient from "../api/HttpClient";
import type { UserAttributes } from "../models/interfaces";

const authApiUrl = import.meta.env.VITE_AUTH_API_URL;

export class AuthService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = httpClient.create({ baseURL: authApiUrl });
    this.http.interceptors.request.use(
      (config) => {
        // Exemple : ajouter un token d'authentification
        const token = localStorage.getItem("jwtoken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        console.log("Requête interceptée :", config.url);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
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

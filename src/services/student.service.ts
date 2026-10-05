import type { AxiosInstance } from "axios";
import type { ParentAttributes } from "../models/interfaces";
import httpClient from "../api/HttpClient";

const apiUrl = import.meta.env.VITE_API_URL;

export class StudentService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = httpClient.create({ baseURL: apiUrl });
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

  public async findParents(studentId: number): Promise<ParentAttributes[]> {
    const url = `/students/${studentId}/parents`;
    const result = await this.http.get(url);
    return result.data;
  }
}

import type { AxiosInstance } from "axios";
import type { AbsenceAttributes } from "../models/interfaces";
import httpClient from "../api/HttpClient";

const apiUrl = import.meta.env.VITE_API_URL;

export class AbsenceService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = httpClient.create({ baseURL: apiUrl });
  }

  public async getOnGoingAbsences(): Promise<AbsenceAttributes[]> {
    const result = await this.http.get(`/absences/ongoing`);
    return result.data;
  }
}

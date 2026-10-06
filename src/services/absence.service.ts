/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance } from "axios";
import type {
  AbsenceAttributes,
  AbsenceReasonStdAttributes,
  AlertSentAttributes,
  AlertSentType,
  ClassLevelAttributes,
  StudentAttributes,
} from "../models/interfaces";
import httpClient from "../api/HttpClient";
import type { createAbsenceDto } from "../models/dto";

const apiUrl = import.meta.env.VITE_API_URL;

export class AbsenceService {
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

  public async getOnGoingAbsences(): Promise<AbsenceAttributes[]> {
    const result = await this.http.get(`/absences/ongoing`);
    return result.data;
  }

  public async getAllClassLevels(): Promise<ClassLevelAttributes[]> {
    const result = await this.http.get("/class-levels");
    return result.data;
  }

  public async findStudents(filter: {
    class_level?: number;
    name?: string;
  }): Promise<StudentAttributes[]> {
    let url = `/students?`;
    for (const key in filter) {
      if ((filter as any)[key] != undefined) {
        url += `&${key}=${(filter as any)[key]}`;
      }
    }
    const result = await this.http.get(url);
    return result.data;
  }

  public async createAbsence(
    body: createAbsenceDto,
  ): Promise<AbsenceAttributes[]> {
    const url = "/absences";
    const result = await this.http.post(url, body);
    return result.data;
  }

  public async getMessageModel(
    absenceId: number,
    alertType: AlertSentType,
  ): Promise<{ message: string }> {
    const url = `/absences/${absenceId}/message-model?alertType=${alertType}`;
    const result = await this.http.get(url);
    return result.data;
  }

  public async getLastAlertSent(
    absenceId: number,
    alertType: AlertSentType,
  ): Promise<AlertSentAttributes | null> {
    const url = `/absences/${absenceId}/last-alert-sent?alertType=${alertType}`;
    const result = await this.http.get(url);
    return result.data;
  }

  public async sendAlert(
    absenceId: number,
    alertType: AlertSentType,
    parentId?: number,
  ) {
    let url = `/absences/${absenceId}/send-alert?alertType=${alertType}`;
    if (parentId) url += `&parentId=${parentId}`;
    await this.http.post(url);
  }

  public async getReasonStds(): Promise<AbsenceReasonStdAttributes[]> {
    const url = "/absence-reason-stds";
    const result = await this.http.get(url);
    return result.data;
  }

  public async sendAbsenceReturn(
    absenceId: number,
    body: {
      returnDate: Date;
      reasonStdId?: number;
      reasonDetail: string;
    },
  ) {
    const url = `/absences/${absenceId}/return`;
    await this.http.post(url, body);
  }
}

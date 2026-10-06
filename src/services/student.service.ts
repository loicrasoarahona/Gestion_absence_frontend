import type { AxiosInstance } from "axios";
import type {
  PaginatedResultDto,
  ParentAttributes,
  StudentAttributes,
} from "../models/interfaces";
import httpClient from "../api/HttpClient";
import type { StudentAttendanceReportDto } from "../models/dto";

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

  public async getAllPaginated(
    page: number = 1,
    class_level?: number,
    name?: string,
  ): Promise<PaginatedResultDto<StudentAttributes>> {
    let url = `/students/paginated?page=${page}`;
    if (class_level) url += `&class_level=${class_level}`;
    if (name) url += `&name=${name}`;
    const result = await this.http.get(url);
    return result.data;
  }

  public async getAttendanceReport(
    studentId: number,
    from: string,
    to: string,
  ): Promise<StudentAttendanceReportDto> {
    const url = `/students/${studentId}/attendance-report?from=${from}&to=${to}`;
    const result = await this.http.get(url);
    return result.data;
  }
}

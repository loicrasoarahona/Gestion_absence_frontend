import axios from "axios";
import type { AxiosInstance } from "axios";

const CLIENT_ID = "gestion_absence";

export function createHttpClient(baseURL?: string): AxiosInstance {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use(
    (config) => {
      config.headers["X-Client-Id"] = CLIENT_ID;

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

  return instance;
}

const httpClient = createHttpClient();

export default httpClient;

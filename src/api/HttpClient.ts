import axios from "axios";

const httpClient = axios.create();

httpClient.interceptors.request.use(
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

export default httpClient;

import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000', // fastapi on port 8000
    withCredentials: true, // enable credentials
  });

export default api;
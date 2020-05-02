import axios from "axios";

export const API_URL = process.env.API_URL || "http://localhost:4000";

export const API = axios.create({
  baseURL: API_URL
});

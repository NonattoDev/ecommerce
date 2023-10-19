import axios from "axios";

const axiosCliente = axios.create({
  baseURL: process.env.BASE_URL_DB || "http://localhost:3001",
});

export default axiosCliente;

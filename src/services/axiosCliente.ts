import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.BASE_URL || "http://10.71.0.119:3001/";

const axiosCliente = axios.create({
  baseURL: baseURL,
});

export default axiosCliente;

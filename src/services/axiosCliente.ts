import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = "http://localhost:3001/";

const axiosCliente = axios.create({
  baseURL: baseURL,
});

export default axiosCliente;

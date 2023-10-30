import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL = "http://192.168.1.3:3001/";

const axiosCliente = axios.create({
  baseURL: baseURL,
});

export default axiosCliente;

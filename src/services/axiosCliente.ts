import axios from "axios";
import dotenv from "dotenv";

const axiosCliente = axios.create({
  baseURL: "http://10.0.0.169:3001",
});

export default axiosCliente;

import axios from "axios";
import dotenv from "dotenv";

const axiosCliente = axios.create({
  baseURL: "http://10.71.0.119:3001",
});

export default axiosCliente;

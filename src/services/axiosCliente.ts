import axios from "axios";

const axiosCliente = axios.create({
  baseURL: "http://172.16.204.208:3001",
});

export default axiosCliente;

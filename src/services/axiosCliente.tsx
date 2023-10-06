import axios from "axios";
const axiosCliente = axios.create({
  // baseURL: "http://10.71.0.117:3001/",
  baseURL: "http://192.168.1.10:3001/",
});

export default axiosCliente;

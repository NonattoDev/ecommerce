import axios from "axios";

const axiosCliente = axios.create({
  baseURL: "http://192.168.1.7:3001",
});

export default axiosCliente;

import axios from "axios";

const axiosCliente = axios.create({
  baseURL: "http://192.168.15.61:3001",
});

export default axiosCliente;

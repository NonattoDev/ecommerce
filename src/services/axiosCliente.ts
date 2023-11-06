import axios from "axios";

const axiosCliente = axios.create({
  baseURL: "http://10.71.0.119:3001",
});

export default axiosCliente;

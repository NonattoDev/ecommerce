import axios from "axios";

const axiosCliente = axios.create({
  baseURL: "http://localhost:3001",
});

export default axiosCliente;

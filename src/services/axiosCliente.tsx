import axios from "axios";

const meuIP = "10.71.0.119";

const axiosCliente = axios.create({
  baseURL: `http://${meuIP}:3001/`,
});

export default axiosCliente;

import axios from "axios";
import ip from "ip";

const meuIP = "192.168.1.3";

const axiosCliente = axios.create({
  baseURL: `http://${meuIP}:3001/`,
});

export default axiosCliente;

import axios from "axios";
import ip from "ip";

const meuIP = "192.168.1.7";

const axiosCliente = axios.create({
  baseURL: `http://${meuIP}:3001/`,
});

export default axiosCliente;

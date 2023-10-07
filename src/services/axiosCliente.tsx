import os from "os";
import axios from "axios";

const networkInterfaces = os.networkInterfaces();
let ipAddress: string;

if (networkInterfaces && networkInterfaces["Wi-Fi"]) {
  ipAddress = networkInterfaces["Wi-Fi"][1].address;
  console.log(ipAddress);
} else {
  ipAddress = "localhost";
}

console.log(ipAddress);

const axiosCliente = axios.create({
  baseURL: `http://${ipAddress}:3001/`,
});

export default axiosCliente;

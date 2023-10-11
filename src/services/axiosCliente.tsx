import os from "os";
import axios from "axios";

const networkInterfaces = os.networkInterfaces();
let ipAddress: string | undefined;

const wifiInterface = networkInterfaces["Wi-Fi"];
const ethernetInterface = networkInterfaces["Ethernet"];

if (ethernetInterface && ethernetInterface.some((iface) => /\d+\.\d+\.\d+\.\d+/.test(iface.address))) {
  ipAddress = ethernetInterface.find((iface) => /\d+\.\d+\.\d+\.\d+/.test(iface.address))?.address;
} else if (wifiInterface && wifiInterface.some((iface) => /\d+\.\d+\.\d+\.\d+/.test(iface.address))) {
  ipAddress = wifiInterface.find((iface) => /\d+\.\d+\.\d+\.\d+/.test(iface.address))?.address;
}

if (!ipAddress) {
  ipAddress = "localhost";
}

const axiosCliente = axios.create({
  baseURL: `http://192.168.1.7:3001/`,
});

export default axiosCliente;

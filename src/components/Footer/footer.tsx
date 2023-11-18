import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  borderRadius: "10px",
  width: "300px",
  height: "300px",
  maxWidth: "100%",
  maxHeigth: "100%",
};

interface Informacoes {
  Empresa: string;
  Razao: string;
  Endereco: string;
  bairro: string;
  Cidade: string;
  Estado: string;
  Cep: string;
  Tel: string;
  tel2: string;
  Email: string;
}
const Footer = () => {
  const [informacoes, setInformacoes] = useState<Informacoes[]>([]);
  const [mapPosition, setMapPosition] = useState({ lat: -23.5505, lng: -46.6333 }); // Coordenadas padrão (São Paulo)

  useEffect(() => {
    axios.get("/api/empresa/dadosempresa").then(async (response) => {
      const data = response.data;
      setInformacoes(data);

      if (data.length > 0) {
        const enderecoCompleto = `${data[0].Endereco}, ${data[0].bairro}, ${data[0].Cidade}, ${data[0].Estado}`;
        try {
          const { data } = await axios.post("/api/geocode", { address: enderecoCompleto });
          setMapPosition(data); // Atualiza o estado com as novas coordenadas
        } catch (error) {
          console.error("Erro ao obter coordenadas:", error);
        }
      }
    });
  }, []);

  return (
    <footer className="bg-success text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            {informacoes.map((info) => (
              <div key={info.Empresa} className="row mb-3">
                <div className="col-6">
                  <h5>{info.Empresa}</h5>
                  <p>Razão: {info.Razao}</p>
                  <p>Endereço: {info.Endereco}</p>
                  <p>Bairro: {info.bairro}</p>
                  <p>Cidade: {info.Cidade}</p>
                </div>
                <div className="col-6">
                  <br />
                  <p>Estado: {info.Estado}</p>
                  <p>CEP: {info.Cep}</p>
                  <p>Telefone: {info.Tel}</p>
                  <p>Telefone 2: {info.tel2}</p>
                  <p>Email: {info.Email}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end">
            <div>
              <Link href="https://softlineinfo.com.br" style={{ textDecoration: "none", color: "#fff", textAlign: "center" }}>
                <span>Site produzido por Soft Line Sistemas</span>
              </Link>
              <LoadScript googleMapsApiKey="AIzaSyAYSb2k0Y8sZzZNFOgsDwNCAlw4AALzKZY">
                <GoogleMap mapContainerStyle={containerStyle} center={mapPosition} zoom={18}>
                  <Marker position={mapPosition} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

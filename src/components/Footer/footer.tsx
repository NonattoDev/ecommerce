import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";

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
      <Container>
        <Row>
          <Col xs={12} md={6}>
            {informacoes.map((info) => (
              <Row key={info.Empresa} className="mb-3">
                <Col xs={7} md={6}>
                  <h5>{info.Empresa}</h5>
                  <p>Razão: {info.Razao}</p>
                  <p>Endereço: {info.Endereco}</p>
                  <p>Bairro: {info.bairro}</p>
                  <p>Cidade: {info.Cidade}</p>
                </Col>
                <Col xs={6}>
                  <br />
                  <p>Estado: {info.Estado}</p>
                  <p>CEP: {info.Cep}</p>
                  <p>Telefone: {info.Tel}</p>
                  <p>Telefone 2: {info.tel2}</p>
                  <p>Email: {info.Email}</p>
                </Col>
              </Row>
            ))}
          </Col>

          <Col xs={12} md={6} className="d-flex justify-content-md-end">
            <div>
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API || ""}>
                <GoogleMap mapContainerStyle={containerStyle} center={mapPosition} zoom={18}>
                  <Marker position={mapPosition} />
                </GoogleMap>
              </LoadScript>
              <Link href="https://softlineinfo.com.br" style={{ textDecoration: "none", color: "#fff", textAlign: "center" }}>
                <span>Site produzido por Soft Line Sistemas</span>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

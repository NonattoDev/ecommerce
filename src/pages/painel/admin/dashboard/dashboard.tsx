// Dashboard.js ou Dashboard.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GraficoVendedor from "./components/VendedoresChart/GraficoVendedor";
import ProdutosMaisVendidosChart from "./components/ProdutosMaisVendidos/ProdutosMaisVendidosChart";
import TabelaDeVendasRT from "./components/TabelaDeVendasRT/TabelaDeVendasRT";

const Dashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <GraficoVendedor />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <ProdutosMaisVendidosChart />
        </Col>
      </Row>
      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
        <TabelaDeVendasRT />
      </Col>
    </Container>
  );
};

export default Dashboard;

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Custom404 = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
      <Row>
        <Col md={12} className="text-center">
          <h1 className="display-1 font-weight-bold">404</h1>
          <p className="lead">Página Não Encontrada</p>
          <p>Desculpe, a página que você está procurando não existe.</p>
          <Button variant="primary" href="/">
            Voltar para a Página Inicial
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Custom404;

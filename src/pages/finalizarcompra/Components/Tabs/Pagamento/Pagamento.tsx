import React from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import Cartao from "./Cartao/PagamentoCartao";
import PagamentoBoleto from "./Boleto/PagamentoBoleto";
import PagamentoPix from "./Pix/PagamentoPix";

const Pagamento = () => {
  const boletoHabilitado = process.env.NEXT_PUBLIC_PAGSEGURO_FORMA_BOLETO === "TRUE";
  const cartaoHabilitado = process.env.NEXT_PUBLIC_PAGSEGURO_FORMA_CARTAO === "TRUE";
  const pixHabilitado = process.env.NEXT_PUBLIC_PAGSEGURO_FORMA_PIX === "TRUE";

  return (
    <Card style={{ marginBottom: "30px" }}>
      <Card.Header>Tela de pagamento</Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="Cartão" id="uncontrolled-tab-example" className="mb-3">
          {cartaoHabilitado && (
            <Tab eventKey="Cartão" title="Cartão">
              <Cartao />
            </Tab>
          )}
          {pixHabilitado && (
            <Tab eventKey="Pix" title="Pix">
              <PagamentoPix />
            </Tab>
          )}
          {boletoHabilitado ? (
            <Tab eventKey="Boleto" title="Boleto">
              <PagamentoBoleto />
            </Tab>
          ) : (
            <Tab eventKey="Boleto" title="Boleto" disabled>
              <PagamentoBoleto />
            </Tab>
          )}
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default Pagamento;

import React, { useState } from "react";
import { Card, Tab, Tabs } from "react-bootstrap";
import Cartao from "./Cartao/PagamentoCartao";
import PagamentoBoleto from "./Boleto/PagamentoBoleto";
import PagamentoPix from "./Pix/PagamentoPix";

const Pagamento = () => {
  const boletoHabilitado = process.env.NEXT_PUBLIC_PAGSEGURO_FORMA_BOLETO === "TRUE";
  const cartaoHabilitado = process.env.NEXT_PUBLIC_PAGSEGURO_FORMA_CARTAO === "TRUE";
  const pixHabilitado = process.env.NEXT_PUBLIC_PAGSEGURO_FORMA_PIX === "TRUE";

  // Estado para manter a chave única para forçar a remontagem
  const [key, setKey] = useState(0);

  // Função para trocar a aba e resetar os componentes
  const handleSelect = () => {
    // Incrementa a chave para forçar a remontagem dos componentes
    setKey((prevKey) => prevKey + 1);
  };

  return (
    <Card style={{ marginBottom: "30px" }}>
      <Card.Header>Tela de pagamento</Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="Cartão" id="uncontrolled-tab-example" className="mb-3" onSelect={handleSelect}>
          {cartaoHabilitado && (
            <Tab eventKey="Cartão" title="Cartão" key={`Cartao-${key}`}>
              <Cartao />
            </Tab>
          )}
          {pixHabilitado && (
            <Tab eventKey="Pix" title="Pix" key={`Pix-${key}`}>
              <PagamentoPix />
            </Tab>
          )}
          {boletoHabilitado ? (
            <Tab eventKey="Boleto" title="Boleto" key={`Boleto-${key}`}>
              <PagamentoBoleto />
            </Tab>
          ) : (
            <Tab eventKey="Boleto" title="Boleto" disabled key={`Boleto-${key}`}>
              <PagamentoBoleto />
            </Tab>
          )}
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default Pagamento;

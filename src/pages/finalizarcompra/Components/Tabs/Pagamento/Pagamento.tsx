import { Card, Tab, Tabs } from "react-bootstrap";
import Cartao from "./Cartao/PagamentoCartao";
import PagamentoBoleto from "./Boleto/PagamentoBoleto";
import PagamentoPix from "./Pix/pix";

const Pagamento = () => {
  return (
    <Card style={{ marginBottom: "30px" }}>
      <Card.Header>Tela de pagamento</Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="Cartão" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="Cartão" title="Cartão">
            <Cartao />
          </Tab>
          <Tab eventKey="Pix" title="Pix">
            <PagamentoPix />
          </Tab>
          <Tab eventKey="Boleto" title="Boleto">
            <PagamentoBoleto />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default Pagamento;

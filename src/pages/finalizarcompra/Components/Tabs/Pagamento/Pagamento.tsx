import { Card, Tab, Tabs } from "react-bootstrap";
import Cartao from "./Cartao/Cartao";

const Pagamento = () => {
  return (
    <Card>
      <Card.Header>Tela de pagamento</Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="Cartão" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="Cartão" title="Cartão">
            <Cartao />
          </Tab>
          <Tab eventKey="Pix" title="Pix">
            Pix
          </Tab>
          <Tab eventKey="Boleto" title="Boleto">
            Boleto
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default Pagamento;

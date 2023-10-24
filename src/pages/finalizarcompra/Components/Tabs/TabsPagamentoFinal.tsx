import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Resumo from "./Resumo/Resumo";
import Endereco from "./Endereco/Endereco";
import Pagamento from "./Pagamento/Pagamento";

type TabsPagamentoFinalProps = {
  id: number;
};

const TabsPagamentoFinal: React.FC<TabsPagamentoFinalProps> = ({ id }) => {
  return (
    <Tabs defaultActiveKey="resumo" id="fill-tab-example" className="mb-3" fill variant="pills">
      <Tab eventKey="resumo" title="Resumo carrinho">
        <Resumo />
      </Tab>
      <Tab eventKey="endereço" title="Endereco de Entrega">
        <Endereco id={id} />
      </Tab>
      <Tab eventKey="DadosPagamento" title="Dados de Pagamento">
        <Pagamento />
      </Tab>
    </Tabs>
  );
};

export default TabsPagamentoFinal;

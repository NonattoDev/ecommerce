import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { EnderecoContext } from "@/context/EnderecoContexto";
import axiosCliente from "@/services/axiosCliente";
import { useContext, useState } from "react";
import { Form, InputGroup, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const Cartao = () => {
  const { produtosNoCarrinho } = useCarrinhoContext();
  const { endereco } = useContext(EnderecoContext);

  const [dadosPessoais, setDadosPessoais] = useState({
    nomeCompleto: "",
    email: "",
    cpfCnpj: "",
    telefone: "",
  });
  const [dadosCartao, setDadosCartao] = useState({
    nomeCartao: "",
    numeroCartao: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });

  const handleDadosPessoaisChange = (event) => {
    setDadosPessoais({
      ...dadosPessoais,
      [event.target.name]: event.target.value,
    });
  };

  const handleDadosCartaoChange = (event) => {
    setDadosCartao({
      ...dadosCartao,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedProducts = produtosNoCarrinho.map((produto) => {
      return {
        reference_id: produto.Referencia,
        name: produto.Produto,
        quantity: produto.Quantidade,
        unit_amount: produto.Preco1 * 100,
      };
    });

    // Calcular o valor total dos produtos
    const totalAmount = formattedProducts.reduce((total, product) => {
      return total + product.unit_amount * product.quantity;
    }, 0);

    try {
      const resposta = await axiosCliente.post("/pedido/criar-pedido", { dadosPessoais, dadosCartao, formattedProducts, totalAmount, endereco });
    } catch (error) {
      toast.warn(error.message);
    }

    // Aqui você pode usar os dados armazenados nos estados para enviar a requisição ou executar outras ações necessárias
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Label>Seus Dados Pessoais</Form.Label>
      <Row>
        <Col>
          <InputGroup className="mb-3">
            <Form.Control name="nomeCompleto" type="text" placeholder="Nome Completo" onChange={handleDadosPessoaisChange} value={dadosPessoais.nomeCompleto} />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup className="mb-3">
            <Form.Control name="email" type="email" placeholder="Seu email" onChange={handleDadosPessoaisChange} value={dadosPessoais.email} />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup className="mb-3">
            <Form.Control name="cpfCnpj" type="text" placeholder="Digite seu CPF ou CNPJ" onChange={handleDadosPessoaisChange} value={dadosPessoais.cpfCnpj} />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup className="mb-3">
            <Form.Control name="telefone" type="text" placeholder="Telefone/Celular" onChange={handleDadosPessoaisChange} value={dadosPessoais.telefone} />
          </InputGroup>
        </Col>
      </Row>

      <Form.Label>Dados do Cartão</Form.Label>
      <Row>
        <Col md={3}>
          <InputGroup className="mb-3">
            <Form.Control name="nomeCartao" type="text" placeholder="Nome como no cartão" onChange={handleDadosCartaoChange} value={dadosCartao.nomeCartao} />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <InputGroup className="mb-3">
            <Form.Control name="numeroCartao" type="text" placeholder="0000 0000 0000 0000" onChange={handleDadosCartaoChange} value={dadosCartao.numeroCartao} />
          </InputGroup>
        </Col>
        <Col md={1}>
          <InputGroup className="mb-3">
            <Form.Control name="expMonth" type="text" placeholder="MM" onChange={handleDadosCartaoChange} value={dadosCartao.expMonth} />
          </InputGroup>
        </Col>
        <Col md={1}>
          <InputGroup className="mb-3">
            <Form.Control name="expYear" type="text" placeholder="AAAA" onChange={handleDadosCartaoChange} value={dadosCartao.expYear} />
          </InputGroup>
        </Col>
        <Col md={1}>
          <InputGroup className="mb-3">
            <Form.Control name="cvv" type="text" placeholder="CVV" onChange={handleDadosCartaoChange} value={dadosCartao.cvv} />
          </InputGroup>
        </Col>
      </Row>
      <Button type="submit">Finalizar Compra</Button>
    </Form>
  );
};

export default Cartao;

import { useCarrinhoContext } from "@/context/CarrinhoContext";
import axios from "axios";
import { useState } from "react";
import { Form, InputGroup, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const Cartao = () => {
  const { produtosNoCarrinho } = useCarrinhoContext();

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

  const handleSubmit = (event) => {
    event.preventDefault();

    const formattedProducts = produtosNoCarrinho.map((produto) => {
      return {
        reference_id: produto.Referencia,
        name: produto.Produto,
        quantity: produto.Quantidade,
        unit_amount: produto.Preco1,
      };
    });

    // Calcular o valor total dos produtos
    const totalAmount = formattedProducts.reduce((total, product) => {
      return total + product.unit_amount * product.quantity;
    }, 0);

    try {
      const options = {
        method: "POST",
        url: "https://sandbox.api.pagseguro.com/orders",
        headers: {
          accept: "application/json",
          Authorization: "Bearer B871F6967C2341489D37924D761FF1BD",
          "content-type": "application/json",
        },
        data: {
          customer: {
            name: dadosPessoais.nomeCompleto,
            email: dadosPessoais.email,
            tax_id: dadosPessoais.cpfCnpj,
            phones: [{ country: "55", area: "71", number: dadosPessoais.telefone, type: "MOBILE" }],
          },
          shipping: {
            address: {
              street: "Avenida Brigadeiro Faria Lima",
              number: "1384",
              complement: "apto 12",
              locality: "Pinheiros",
              city: "São Paulo",
              region_code: "SP",
              country: "BRA",
              postal_code: "01452002",
            },
          },
          reference_id: "ex-00001",
          items: formattedProducts,
          notification_urls: ["https://meusite.com/notificacoes"],
          charges: [
            {
              reference_id: "referencia da cobranca",
              description: "descricao da cobranca",
              amount: { value: totalAmount * 100, currency: "BRL" },
              payment_method: {
                type: "CREDIT_CARD",
                installments: 1,
                capture: true,
                card: {
                  number: dadosCartao.numeroCartao,
                  exp_month: dadosCartao.expMonth,
                  exp_year: dadosCartao.expYear,
                  security_code: dadosCartao.cvv,
                  holder: { name: dadosCartao.nomeCartao },
                  store: true,
                },
              },
            },
          ],
        },
      };

      console.log(options);

      //   axios
      //     .request(options)
      //     .then(function (response) {
      //       return response.data;
      //     })
      //     .catch(function (error) {
      //       toast.warn(error.message);
      //       return error.message;
      //     });
    } catch (error) {}

    // Aqui você pode usar os dados armazenados nos estados para enviar a requisição ou executar outras ações necessárias
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Button type="submit">Enviar</Button>
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
    </Form>
  );
};

export default Cartao;

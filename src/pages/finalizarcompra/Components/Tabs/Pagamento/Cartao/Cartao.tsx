import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { EnderecoContext } from "@/context/EnderecoContexto";
import axiosCliente from "@/services/axiosCliente";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Form, InputGroup, Row, Col, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
// @ts-ignore
import InputMask from "react-input-mask";
import Loading from "@/components/Loading/Loading";

type FormasDeParcelar = {
  installments: number;
  installment_value: number;
  interest_free: boolean;
  amount: {
    value: number;
    fees: {
      buyer: {
        interest: {
          total: number;
          installments: number;
        };
      };
    };
    currency: string;
  };
};

const Cartao = () => {
  const { produtosNoCarrinho } = useCarrinhoContext();
  const { endereco } = useContext(EnderecoContext);
  const [parcelaSelecionada, setParcelaSelecionada] = useState(0);
  const [formasDeParcelar, setFormasDeParcelar] = useState<FormasDeParcelar[]>();
  const [loading, setLoading] = useState(false);

  const formattedProducts = produtosNoCarrinho.map((produto) => {
    return {
      reference_id: produto.Referencia,
      name: produto.Produto,
      quantity: produto.Quantidade,
      unit_amount: (produto.Preco1 * 100).toFixed(0),
    };
  });

  // Calcular o valor total dos produtos
  const totalAmount = formattedProducts.reduce((total, product) => {
    const unitAmount = parseFloat(product.unit_amount); // ou Number(product.unit_amount)
    return total + unitAmount * product.quantity;
  }, 0);

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
  const handleDadosPessoaisChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDadosPessoais({
      ...dadosPessoais,
      [event.target.name]: event.target.value,
    });
  };
  const handleDadosCartaoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDadosCartao({
      ...dadosCartao,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    if (!dadosPessoais.email) {
      setLoading(false);
      toast.warn("Digite o seu email");
      return;
    }
    if (!dadosPessoais.nomeCompleto) {
      setLoading(false);
      return toast.warn("Digite o seu nome para efetuar a compra");
    }

    if (!dadosPessoais.cpfCnpj) {
      setLoading(false);
      return toast.warn("Digite o seu CPF ou CNPJ");
    }
    if (dadosPessoais.cpfCnpj.length !== 14 && dadosPessoais.cpfCnpj.length !== 11) {
      setLoading(false);
      return toast.warn("Digite um CNPJ ou um CPF válido");
    }
    if (!dadosPessoais.telefone) {
      setLoading(false);
      return toast.warn("Digite o seu telefone");
    }
    if (!dadosCartao.cvv) {
      setLoading(false);
      return toast.warn("Digite o código de segurança do cartão");
    }
    if (!dadosCartao.expMonth) {
      setLoading(false);
      return toast.warn("Digite o mês de expiração do cartão");
    }
    if (!dadosCartao.expYear) {
      setLoading(false);
      return toast.warn("Digite o ano de expiração do cartão");
    }
    if (!dadosCartao.nomeCartao) {
      setLoading(false);
      return toast.warn("Digite o nome como está no cartão apresentado");
    }
    if (!dadosCartao.numeroCartao) {
      setLoading(false);
      return toast.warn("Digite o número do seu cartão");
    }

    try {
      const resposta = await axiosCliente.post("/pedido/criar-pedido/", { dadosPessoais, dadosCartao, formattedProducts, totalAmount: totalAmount.toFixed(0), endereco, parcelaSelecionada });

      if (resposta.data.error_messages) {
        setLoading(false);
        const erros = resposta.data.error_messages;
        erros.forEach((erro: any) => {
          if (erro.description === "must be a valid CPF or CNPJ") return toast.warn("Digite um CPF ou CNPJ Válido");
          toast.warn(erro.parameter_name);
          toast.warn(erro.description);
          return;
        });
      }

      if (resposta?.data?.charges[0]?.payment_response?.code === "20000") {
        //Remover do Localstorage o carrinho com o id que vem da sessão apos a venda efetuada
        setLoading(false);
        return toast.success("Pagamento realizado");
      } else {
        setLoading(false);
        return toast.info(resposta?.data?.charges[0]?.payment_response?.message);
      }
    } catch (error: any) {
      setLoading(false);
      toast.warn(error.message);
    }

    // Aqui você pode usar os dados armazenados nos estados para enviar a requisição ou executar outras ações necessárias
  };
  useEffect(() => {
    if (dadosCartao.numeroCartao.length === 16 || dadosCartao.numeroCartao.length === 15) {
      const fetchParcelas = async () => {
        const resposta = await axiosCliente.get("/pedido/calculoJurosCartao/", {
          params: { totalAmount: totalAmount.toFixed(0), numeroCartao: dadosCartao.numeroCartao.substring(0, 6), parcelaSelecionada: parcelaSelecionada },
        });

        if (resposta.data.error_messages) {
          const erros = resposta.data.error_messages;
          erros.forEach((erro: { description: string }) => {
            return toast.warn(erro.description);
          });
        }

        // Adicione outras bandeiras, se necessário
        const bandeiras = ["mastercard", "visa", "hipercard", "elo", "amex", "maestro", "mercadopago"];

        for (const bandeira of bandeiras) {
          const paymentMethod = resposta.data?.payment_methods?.credit_card?.[bandeira];

          if (paymentMethod) {
            const parcelamento = await paymentMethod.installment_plans;
            setFormasDeParcelar(parcelamento);
            break; // Se encontrou uma bandeira válida, sai do loop
          }
        }
      };

      fetchParcelas();
    }
  }, [dadosCartao.numeroCartao.length === 16, produtosNoCarrinho]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);

    setParcelaSelecionada(selectedValue);
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
            <Form.Control name="cpfCnpj" type="text" placeholder="Digite seu CPF ou CNPJ" onChange={handleDadosPessoaisChange} value={dadosPessoais.cpfCnpj} minLength={11} maxLength={14} />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup className="mb-3">
            <InputMask mask="(99)99999-9999" value={dadosPessoais.telefone} onChange={handleDadosPessoaisChange}>
              {(inputProps: any) => <Form.Control name="telefone" type="text" placeholder="Telefone/Celular" {...inputProps} />}
            </InputMask>
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
            <Form.Control name="numeroCartao" type="text" placeholder="0000 0000 0000 0000" onChange={handleDadosCartaoChange} value={dadosCartao.numeroCartao} maxLength={16} />
          </InputGroup>
        </Col>
        <Col md={1}>
          <InputGroup className="mb-3">
            <Form.Control name="expMonth" type="text" placeholder="MM" onChange={handleDadosCartaoChange} value={dadosCartao.expMonth} maxLength={2} />
          </InputGroup>
        </Col>
        <Col md={1}>
          <InputGroup className="mb-3">
            <Form.Control name="expYear" type="text" placeholder="AAAA" onChange={handleDadosCartaoChange} value={dadosCartao.expYear} maxLength={4} />
          </InputGroup>
        </Col>
        <Col md={1}>
          <InputGroup className="mb-3">
            <Form.Control name="cvv" type="text" placeholder="CVV" onChange={handleDadosCartaoChange} value={dadosCartao.cvv} maxLength={3} />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          {dadosCartao.numeroCartao.length < 13 ? (
            <h6 className="text-muted">Digite o número do seu cartão</h6>
          ) : !formasDeParcelar && dadosCartao.numeroCartao.length > 13 ? (
            <Spinner animation="grow" variant="primary"></Spinner>
          ) : (
            <Form.Select aria-label="qtdParcelas" value={parcelaSelecionada} onChange={handleChange}>
              {formasDeParcelar?.map((forma, index) => (
                <option key={forma.installments} value={forma.installments}>
                  {forma.installments}x de{" "}
                  {(forma.installment_value / 100).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </option>
              ))}
            </Form.Select>
          )}
        </Col>
      </Row>
      {loading ? (
        <div style={{ marginTop: "10px" }}>
          <Loading />
        </div>
      ) : !formasDeParcelar ? (
        <></>
      ) : (
        <Button type="submit" style={{ marginTop: "10px" }}>
          Finalizar Compra
        </Button>
      )}
    </Form>
  );
};

export default Cartao;

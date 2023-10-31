import Loading from "@/components/Loading/Loading";
import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { EnderecoContext } from "@/context/EnderecoContexto";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Button, Card, FormControl, InputGroup, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";

// Criação da interface para o objeto 'dadosPix'
interface DadosPix {
  text: string;
  amount: {
    value: number;
  };
  expiration_date: string;
  links: [
    {
      rel: string;
      href: string;
      media: string;
      type: string;
    }
  ];
}

const PagamentoPix = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const { endereco } = useContext(EnderecoContext);
  const { produtosNoCarrinho, handleRemoverProduto, valorMinimoFreteGratis, handleAtualizarQuantidadeProduto } = useCarrinhoContext();
  const [pix, setPix] = useState(false);
  const [dadosPix, setDadosPix] = useState<DadosPix | undefined>();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (dadosPix?.expiration_date) {
      const interval = setInterval(() => {
        const startTime = moment(); // Mova esta linha para dentro do setInterval
        const endTime = moment(dadosPix.expiration_date);
        const totalTime = endTime.diff(startTime, "seconds");
        const totalDuration = 10 * 60; // 10 minutos em segundos

        const newProgress = (totalTime / totalDuration) * 100;

        console.log("Total Time:", totalTime);
        console.log("New Progress:", newProgress);

        setProgress(newProgress);

        if (newProgress <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dadosPix]);

  const calcularTotalCompra = () => {
    let total = 0;
    produtosNoCarrinho.forEach((produto) => {
      total += produto.Quantidade * produto.Preco1;
    });
    return total;
  };

  const calcularValorFrete = () => {
    const totalCompra = calcularTotalCompra();
    if (totalCompra < valorMinimoFreteGratis) {
      return 100; // Valor fixo para o frete quando o valor mínimo não for atingido
    } else {
      return 0; // Frete grátis quando o valor mínimo for atingido
    }
  };

  const calcularTotalCompraComFrete = () => {
    const totalCompra = calcularTotalCompra();
    const valorFrete = calcularValorFrete();
    return totalCompra + valorFrete;
  };

  const formattedProducts = produtosNoCarrinho.map((produto) => {
    return {
      reference_id: produto.CodPro,
      name: produto.Produto,
      quantity: produto.Quantidade,
      unit_amount: (produto.Preco1 * 100).toFixed(0),
    };
  });

  const [dadosPessoais, setDadosPessoais] = useState({
    name: "",
    email: "",
    cpfCnpj: "",
  });

  const [dadosTelefone, setDadosTelefone] = useState({
    area: "",
    number: "",
  });

  const handleChangePessoais = (e: ChangeEvent<HTMLInputElement>) => {
    setDadosPessoais({
      ...dadosPessoais,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTelefone = (e: ChangeEvent<HTMLInputElement>) => {
    setDadosTelefone({
      ...dadosTelefone,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const resposta = await axios.post("/api/vendas/pix", {
        dadosPessoais,
        dadosTelefone,
        endereco,
        formattedProducts,
        valorCompra: calcularTotalCompraComFrete(),
        CodCli: session?.user?.id,
        valorFrete: calcularValorFrete(),
      });

      if (resposta.data.error_messages) {
        setLoading(false);
        const erros = resposta.data.error_messages;
        erros.forEach((erro: any) => {
          if (erro.description === "must be a valid CPF or CNPJ") return toast.warn("Digite um CPF ou CNPJ Válido");
          toast.warn(erro.description);
        });
        return;
      }

      setLoading(false);

      toast.success(`Seu código QRCODE PIX foi gerado com sucesso, o número do seu pedido é:${resposta?.data?.idVenda} `);
      setPix(true);
      setDadosPix(resposta.data);
      console.log(resposta.data);

      //   router.push("/");
    } catch (error: any) {
      setLoading(false);
      console.log(error);

      return toast.error(error.message);
    }
    // Aqui você pode chamar a API para processar os dados do formulário

    // Você pode combinar os dadosPessoais e dadosTelefone se precisar
  };

  const copiarTexto = (texto: string) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard
        .writeText(texto)
        .then(() => {
          toast.success("Código copiado com sucesso!");
        })
        .catch((error) => {
          toast.error("Erro ao copiar código: " + error.message);
        });
    } else {
      // Fallback for older browsers or when clipboard API isn't supported
      const textarea = document.createElement("textarea");
      textarea.value = texto;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Código copiado com sucesso!");
    }
  };

  return (
    <div className="container mt-5">
      {pix ? (
        <Card.Body style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <div>
            <Card.Img variant="top" src={dadosPix?.links[0].href} style={{ width: "300px", height: "300px" }} />
          </div>
          <div style={{ marginLeft: "30px" }}>
            <Card.Title>Informações do PIX</Card.Title>
            <Card.Text>
              <div>Copia e cola:</div>
              <InputGroup className="mb-3">
                <FormControl type="text" value={dadosPix?.text || ""} readOnly />

                <Button variant="primary" onClick={() => copiarTexto(dadosPix?.text || "")}>
                  Copiar
                </Button>
              </InputGroup>
              <p>Expira em: {moment(dadosPix?.expiration_date).format("HH:mm")}</p>
              <ProgressBar now={progress} max={100} />
              <p>Valor total: R$ {((dadosPix?.amount?.value ?? 0) / 100).toLocaleString("pt-br")}</p>
            </Card.Text>
          </div>
        </Card.Body>
      ) : (
        <form onSubmit={handleSubmit}>
          <h4>Dados do Comprador</h4>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Nome:</label>
              <input type="text" className="form-control" name="name" value={dadosPessoais.name} onChange={handleChangePessoais} required />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Email:</label>
              <input type="email" className="form-control" name="email" value={dadosPessoais.email} onChange={handleChangePessoais} required />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">CPF/CNPJ:</label>
              <input type="text" className="form-control" name="cpfCnpj" value={dadosPessoais.cpfCnpj} onChange={handleChangePessoais} maxLength={14} minLength={11} required />
            </div>
          </div>
          <div className="row">
            <div className="col-md-1 mb-3">
              <label className="form-label">DDD:</label>
              <input type="text" className="form-control" name="area" value={dadosTelefone.area} onChange={handleChangeTelefone} required />
            </div>
            <div className="col-md-2 mb-3">
              <label className="form-label">Número:</label>
              <input type="text" className="form-control" name="number" value={dadosTelefone.number} onChange={handleChangeTelefone} required />
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <button type="submit" className="btn btn-primary">
              Finalizar Pagamento
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default PagamentoPix;

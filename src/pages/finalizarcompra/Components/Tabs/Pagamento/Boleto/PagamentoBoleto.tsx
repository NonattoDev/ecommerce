import Loading from "@/components/Loading/Loading";
import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { EnderecoContext } from "@/context/EnderecoContexto";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";

const PagamentoBoleto = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { endereco } = useContext(EnderecoContext);
  const { produtosNoCarrinho, handleRemoverProduto, valorMinimoFreteGratis, handleAtualizarQuantidadeProduto } = useCarrinhoContext();

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
      const resposta = await axios.post("/api/vendas/boleto", {
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

      console.log(resposta);

      setLoading(false);

      toast.success(`Seu Boleto foi gerado com sucesso, o número do seu pedido é:${resposta?.data?.idVenda} `);
      window.open(resposta?.data?.data?.charges[0]?.links[0]?.href, "_blank");
      //   router.push("/");
    } catch (error: any) {
      setLoading(false);
      console.log(error);

      return toast.error(error.message);
    }
    // Aqui você pode chamar a API para processar os dados do formulário

    // Você pode combinar os dadosPessoais e dadosTelefone se precisar
  };

  return (
    <div className="container mt-5">
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
    </div>
  );
};

export default PagamentoBoleto;

import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { Card, ProgressBar } from "react-bootstrap";

const ProgressBarFrete = () => {
  const { produtosNoCarrinho, handleRemoverProduto, handleAtualizarQuantidadeProduto, valorMinimoFreteGratis } = useCarrinhoContext();

  const calcularTotalCompra = () => {
    let total = 0;
    produtosNoCarrinho.forEach((produto) => {
      total += produto.Quantidade * produto.Preco1;
    });
    return total;
  };

  const totalCompra = calcularTotalCompra();
  const labelFreteGratis = totalCompra >= valorMinimoFreteGratis ? "Que massa! agora o seu frete é grátis" : "Falta pouco para o seu frete ser gratuito";
  const variant = totalCompra >= valorMinimoFreteGratis ? "success" : "info";

  return (
    <Card style={{ padding: "10px", marginTop: "20px", marginBottom: "20px", backgroundColor: "#acacac40" }}>
      <ProgressBar now={totalCompra} max={valorMinimoFreteGratis} label={labelFreteGratis} variant={variant} />
    </Card>
  );
};

export default ProgressBarFrete;

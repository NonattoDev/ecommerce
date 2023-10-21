import { useCarrinhoContext } from "@/context/CarrinhoContext";
import React from "react";
import DetalheProduto from "../../DetalheProduto/DetalheProduto";
import ProgressBarFrete from "../../ProgressBarFrete/ProgressBarFrete";

const Resumo = () => {
  const { produtosNoCarrinho } = useCarrinhoContext();
  return (
    <>
      {produtosNoCarrinho.map((produto) => (
        <DetalheProduto key={produto.CodPro} produto={produto} />
      ))}
      <ProgressBarFrete />
    </>
  );
};
export default Resumo;

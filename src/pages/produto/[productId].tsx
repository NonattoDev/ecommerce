import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import axiosCliente from "@/services/axiosCliente";

interface Produto {
  CodPro: number;
  Produto: string;
  Referencia: string;
  Preco1: number;
  PrecoPromocao: number | null;
  PromocaoData: string | null;
  Caminho: string;
  Categoria: string;
  Estoque: number;
}

function Produto() {
  const router = useRouter();
  const { productId } = router.query;
  const [produto, setProduto] = useState<Produto>({} as Produto);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axiosCliente.get<Produto>(`/produtos/produtoEspecifico/${productId}`);
        setProduto(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduto();
  }, [productId]);

  return (
    <div>
      <h1>Página do produto: {productId}</h1>
      {produto.Produto && (
        <div>
          <h2>Detalhes do produto</h2>
          <p>Nome: {produto.Produto}</p>
          <p>Referência: {produto.Referencia}</p>
          <p>Preço: {produto.Preco1}</p>
          {produto.PrecoPromocao && <p>Preço de Promoção: {produto.PrecoPromocao}</p>}
          {produto.PromocaoData && <p>Data da Promoção: {produto.PromocaoData}</p>}
          <img src={`/fotosProdutos/${produto.Caminho}`} alt="Imagem do produto" />
          <p>Categoria: {produto.Categoria}</p>
          <p>Estoque: {produto.Estoque}</p>
          {/* Renderize outros detalhes do produto */}
        </div>
      )}
    </div>
  );
}

export default Produto;

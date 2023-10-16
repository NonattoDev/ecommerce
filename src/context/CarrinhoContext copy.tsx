import { Produto } from "@/Types/Produto";
import axiosCliente from "@/services/axiosCliente";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

interface CarrinhoContextData {
  produtosNoCarrinho: Produto[];
  handleAdicionarProdutosAoCarrinho: (produto: Produto) => void;
  handleRemoverProduto: (CodPro: number) => void;
  valorMinimoFreteGratis: number;
  handleAtualizarQuantidadeProduto: (CodPro: number, novaQuantidade: number) => void;
}

const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData);

export const CarrinhoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [produtosNoCarrinho, setProdutosNoCarrinho] = useState<Produto[]>(getCarrinhoFromLocalStorage());
  const [valorMinimoFreteGratis, setValorMinimoFreteGratis] = useState<number>(0);

  useEffect(() => {
    async function fetchValorMinimo() {
      try {
        const response = await axiosCliente.get("/empresa/compras");
        setValorMinimoFreteGratis(response.data.freteGratis);
      } catch (error) {
        console.error("Erro ao obter o valor mínimo:", error);
      }
    }

    fetchValorMinimo();
  }, []);

  const handleAdicionarProdutosAoCarrinho = useCallback((produto: Produto) => {
    setProdutosNoCarrinho((prevProdutos) => {
      let carrinhoAtualizado = [...prevProdutos];
      let produtoExistente = false;

      carrinhoAtualizado = carrinhoAtualizado.map((p) => {
        if (p.CodPro === produto.CodPro) {
          produtoExistente = true;
          return {
            ...p,
            Quantidade: p.Quantidade + produto.Quantidade,
          };
        }
        return p;
      });

      if (!produtoExistente) {
        carrinhoAtualizado.push(produto);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("carrinho", JSON.stringify(carrinhoAtualizado));
      }

      return carrinhoAtualizado;
    });
  }, []);

  const handleRemoverProduto = (CodPro: number) => {
    // Filtra os produtos removendo o produto com o ID correspondente
    const novosProdutos = produtosNoCarrinho.filter((p) => p.CodPro !== CodPro);

    // Atualiza o estado com os novos produtos
    setProdutosNoCarrinho(novosProdutos);

    // Atualiza o localStorage com os novos produtos
    if (typeof window !== "undefined") {
      localStorage.setItem("carrinho", JSON.stringify(novosProdutos));
    }
  };
  const handleAtualizarQuantidadeProduto = useCallback((CodPro: number, novaQuantidade: number) => {
    setProdutosNoCarrinho((prevProdutos) => {
      const carrinhoAtualizado = prevProdutos.map((p) => {
        if (p.CodPro === CodPro) {
          return {
            ...p,
            Quantidade: novaQuantidade,
          };
        }
        return p;
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("carrinho", JSON.stringify(carrinhoAtualizado));
      }

      return carrinhoAtualizado;
    });
  }, []);

  return (
    <CarrinhoContext.Provider value={{ produtosNoCarrinho, handleAdicionarProdutosAoCarrinho, handleRemoverProduto, valorMinimoFreteGratis, handleAtualizarQuantidadeProduto }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export function useCarrinhoContext() {
  return useContext(CarrinhoContext);
}

export const getCarrinhoFromLocalStorage = (): Produto[] => {
  if (typeof window !== "undefined") {
    const carrinhoString = localStorage.getItem("carrinho");
    if (carrinhoString) {
      return JSON.parse(carrinhoString);
    }
  }
  return [];
};

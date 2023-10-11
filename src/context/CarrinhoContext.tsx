import { Produto } from "@/Types/Produto";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CarrinhoContextData {
  produtosNoCarrinho: Produto[];
  handleAdicionarProdutosAoCarrinho: (produto: Produto) => void;
  handleRemoverProduto: (CodPro: number) => void;
}

const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData);

export const CarrinhoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [produtosNoCarrinho, setProdutosNoCarrinho] = useState<Produto[]>(getCarrinhoFromLocalStorage());

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
  };

  return <CarrinhoContext.Provider value={{ produtosNoCarrinho, handleAdicionarProdutosAoCarrinho, handleRemoverProduto }}>{children}</CarrinhoContext.Provider>;
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

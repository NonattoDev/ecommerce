import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Produto } from "@/Types/Produto";
import axiosCliente from "@/services/axiosCliente";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { toast } from "react-toastify";

interface CarrinhoContextData {
  produtosNoCarrinho: Produto[];
  handleAdicionarProdutosAoCarrinho: (produto: Produto) => void;
  handleRemoverProduto: (CodPro: number) => void;
  valorMinimoFreteGratis: number;
  handleAtualizarQuantidadeProduto: (CodPro: number, novaQuantidade: number) => void;
  fetchCarrinho: () => Promise<void>;
}

const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData);

export const CarrinhoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [produtosNoCarrinho, setProdutosNoCarrinho] = useState<Produto[]>([]);
  const [valorMinimoFreteGratis, setValorMinimoFreteGratis] = useState<number>(0);
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    async function fetchValorMinimo() {
      try {
        const response = await axiosCliente.get("/empresa/compras");
        setValorMinimoFreteGratis(response.data.freteGratis);
      } catch (error) {
        console.error("Erro ao obter o valor mínimo:", error);
      }
    }
    fetchCarrinho();
    fetchValorMinimo();
  }, []);

  const handleAdicionarProdutosAoCarrinho = useCallback(
    (produto: Produto) => {
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

        if (typeof window !== "undefined" && session?.user) {
          localStorage.setItem(`carrinho_${session.user.id}`, JSON.stringify(carrinhoAtualizado));
        }

        return carrinhoAtualizado;
      });
    },
    [session]
  );

  const handleRemoverProduto = (CodPro: number) => {
    // Filtra os produtos removendo o produto com o ID correspondente
    const novosProdutos = produtosNoCarrinho.filter((p) => p.CodPro !== CodPro);

    // Atualiza o estado com os novos produtos
    setProdutosNoCarrinho(novosProdutos);

    // Atualiza o localStorage com os novos produtos
    if (typeof window !== "undefined" && session?.user) {
      localStorage.setItem(`carrinho_${session?.user.id}`, JSON.stringify(novosProdutos));
    }
  };

  const handleAtualizarQuantidadeProduto = useCallback(
    (CodPro: number, novaQuantidade: number) => {
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

        if (typeof window !== "undefined" && session?.user) {
          localStorage.setItem(`carrinho_${session?.user.id}`, JSON.stringify(carrinhoAtualizado));
        }

        return carrinhoAtualizado;
      });
    },
    [session]
  );

  async function fetchCarrinho() {
    const currentSession = await getSession();
    if (currentSession) {
      setSession(currentSession);
      const userId = currentSession.user.id;
      const carrinho = getCarrinhoFromLocalStorage(userId);
      setProdutosNoCarrinho(carrinho);
    }
  }

  return (
    <CarrinhoContext.Provider value={{ fetchCarrinho, produtosNoCarrinho, handleAdicionarProdutosAoCarrinho, handleRemoverProduto, valorMinimoFreteGratis, handleAtualizarQuantidadeProduto }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export function useCarrinhoContext() {
  return useContext(CarrinhoContext);
}

export const getCarrinhoFromLocalStorage = (userId: string): Produto[] => {
  if (typeof window !== "undefined") {
    const carrinhoString = localStorage.getItem(`carrinho_${userId}`);
    if (carrinhoString) {
      return JSON.parse(carrinhoString);
    }
  }

  return [];
};

import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import type { DefaultSession } from "next-auth";
import { Session } from "next-auth";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

const finalizarCompra = () => {
  const [session, setSession] = useState<Session | undefined>();
  const { produtosNoCarrinho } = useCarrinhoContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const recuperarSessaoDoUsuario = async () => {
      setLoading(true);
      const session = await getSession();
      if (session && session.user && session.user.id) {
        setSession(session);
        setLoading(false);
      }
      if (!session) {
        return toast.warn("Por favor, faça login para continuar");
      }
    };

    recuperarSessaoDoUsuario();
  }, [produtosNoCarrinho]);

  if (!session) {
    return (
      <div className="container">
        <div className="notification is-warning">Esta rota é apenas para usuários logados.</div>
      </div>
    );
  }

  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <div>
          {session ? "Com Sessão" : "Sem sessão"}
          {produtosNoCarrinho.map((produto, index) => (
            <div key={index}>
              <h3>{produto.Produto}</h3>
              <p>Preço: R${produto.Preco1}</p>
              <p>Quantidade: {produto.Quantidade}</p>
              <p>Categoria: {produto.Categoria}</p>
              {/* Exibir outras informações do produto aqui */}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default finalizarCompra;

import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import type { DefaultSession } from "next-auth";
import { Session } from "next-auth";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
import { Alert, Container } from "react-bootstrap";
import TabsPagamentoFinal from "./Components/Tabs/TabsPagamentoFinal";
import { EnderecoProvider } from "@/context/EnderecoContexto";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      cliente: string;
    };
  }
}

const finalizarCompra = () => {
  const [session, setSession] = useState<Session | undefined>();
  const { produtosNoCarrinho } = useCarrinhoContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const recuperarSessaoDoUsuario = async () => {
      const session = await getSession();
      setLoading(true);
      if (session && session.user && session.user.id) {
        setSession(session);
        setLoading(false);
      }
      if (!session) {
        setLoading(false);
        return toast.warn("Por favor, faça login para continuar");
      }
    };

    recuperarSessaoDoUsuario();
  }, [produtosNoCarrinho]);

  if (!session) {
    return (
      <Container>
        <div style={{ height: "287px", margin: "50px" }}>
          <Alert variant="warning">Esta rota é apenas para usuários logados.</Alert>
        </div>
      </Container>
    );
  }

  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <Container>
          <div style={{ marginTop: "20px" }}>
            {session && <h4>Olá {session.user.cliente}, esse é o resumo do seu carrinho </h4>}
            {produtosNoCarrinho.length === 0 ? (
              <p>Você ainda não tem itens no carrinho, inicie as compras</p>
            ) : (
              <>
                <EnderecoProvider>
                  <TabsPagamentoFinal id={session.user.id} />
                </EnderecoProvider>
              </>
            )}
          </div>
        </Container>
      )}
    </>
  );
};

export default finalizarCompra;

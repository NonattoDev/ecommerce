import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { useSession } from "next-auth/react";
import React from "react";
import { Alert, Container } from "react-bootstrap";
import TabsPagamentoFinal from "./Components/Tabs/TabsPagamentoFinal";
import { EnderecoProvider } from "@/context/EnderecoContexto";



const finalizarCompra = () => {
  const { produtosNoCarrinho } = useCarrinhoContext();
  const { data: sessao, status } = useSession({
    required: true,
    onUnauthenticated() {
      return (
        <Container>
          <div style={{ height: "287px", margin: "50px" }}>
            <Alert variant="warning">Esta rota é apenas para usuários logados.</Alert>
          </div>
        </Container>
      );
    },
  });

  if (status === "loading") {
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
      <Container>
        <div style={{ marginTop: "20px" }}>
          {sessao && <h4>Olá {sessao.user.cliente}, esse é o resumo do seu carrinho </h4>}
          {produtosNoCarrinho.length === 0 ? (
            <p>Você ainda não tem itens no carrinho, inicie as compras</p>
          ) : (
            <>
              <EnderecoProvider>
                <TabsPagamentoFinal id={parseInt(sessao.user.id)} />
              </EnderecoProvider>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default finalizarCompra;

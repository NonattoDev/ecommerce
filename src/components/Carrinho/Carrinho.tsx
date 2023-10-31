import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./Carrinho.module.css";
import { useCarrinhoContext } from "../../context/CarrinhoContext";
import { Form } from "react-bootstrap";
import { Produto } from "@/Types/Produto";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faCartShopping } from "@fortawesome/free-solid-svg-icons";

function Carrinho() {
  const router = useRouter();
  const [quantidadeTotal, setQuantidadeTotal] = useState(0); // Declare quantidadeTotal state
  const { produtosNoCarrinho, handleRemoverProduto, valorMinimoFreteGratis, handleAtualizarQuantidadeProduto } = useCarrinhoContext();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [session, setSession] = useState({});

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      if (!session) {
        return {};
      }
      setSession(session);
    }

    fetchSession();
  }, []);

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

  const atualizarQuantidadeProduto = (CodPro: number, novaQuantidade: number) => {
    handleAtualizarQuantidadeProduto(CodPro, novaQuantidade);
  };

  useEffect(() => {
    setQuantidadeTotal(calcularQuantidadeTotal());
  }, [produtosNoCarrinho]);

  const calcularQuantidadeTotal = () => {
    let quantidadeTotal = 0;
    produtosNoCarrinho.forEach((produto: Produto) => {
      quantidadeTotal += produto.Quantidade;
    });
    return quantidadeTotal;
  };

  const handleNegociarVendedor = async () => {
    try {
      setShow(false);
      // Enviar como proposta para o enterprise via AXIOS
      const resposta = await axios.post("/api/vendas/negociar", { produtosNoCarrinho, session, valorFrete: calcularValorFrete() });

      // Receber como retorno um ID do orçamento para poder criar um Dashboard

      // Zerar o Carrinho no LocalStorage com o ID do usuario

      //Redirecionar para página principal
      router.push("/");
      toast.success(`Um vendedor recebeu o seu pedido, o número da sua proposta é ${resposta.data.idProposta}`, { position: "top-center" });

      return;
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <span>
        <FontAwesomeIcon
          icon={faCartPlus}
          onClick={handleShow}
          data-count={quantidadeTotal}
          cursor={"pointer"}
          style={{ background: "none", border: "none", cursor: "pointer", color: "blue", width: "30px" }}
        />
      </span>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Carrinho</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={styles.itensCarrinho}>
            {produtosNoCarrinho.length === 0 ? (
              <div className={styles.carrinhoVazio}>Você ainda não tem itens no carrinho, inicie as compras</div>
            ) : (
              produtosNoCarrinho.map((produto) => (
                <div className={styles.itemCarrinho} key={produto.CodPro}>
                  <img src={`/fotosProdutos/${produto.Caminho}`} alt={produto.Produto} className={styles.imagemProduto} />
                  <div className={styles.detalhesProduto}>
                    <div className={styles.detalhesProdutoRow}>
                      <p>{produto.Produto}</p>
                      <button className={styles.botaoRemover} onClick={() => handleRemoverProduto(produto.CodPro)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className={styles.detalhesProdutoRow}>
                      <p>R$ {produto.Preco1.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <Form.Control
                        name="quantidadeProduto"
                        type="number"
                        value={produto.Quantidade > produto.Estoque ? produto.Estoque : produto.Quantidade || 0}
                        onChange={(e) => {
                          const quantidade = e.target.value === "" ? 1 : parseInt(e.target.value);
                          const valorMaximo = produto.Estoque;
                          const novaQuantidade = quantidade > valorMaximo ? valorMaximo : quantidade;
                          atualizarQuantidadeProduto(produto.CodPro, novaQuantidade);
                        }}
                        className={styles.inputQuantidade}
                        min={1}
                        max={produto.Estoque}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {produtosNoCarrinho.length > 0 && (
            <div className={styles.resumoCarrinho}>
              <h6>
                Quantidade total de itens no carrinho: <strong>{calcularQuantidadeTotal()}</strong>
              </h6>
              <h6>
                Total da compra: <strong>R$ {calcularTotalCompra().toLocaleString("pt-br", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong>
              </h6>
              <h6>
                Valor do frete: <strong>R$ {calcularValorFrete().toLocaleString("pt-br", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong>
              </h6>
              <h6>
                Total da compra com frete: <strong>R$ {calcularTotalCompraComFrete().toLocaleString("pt-br", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</strong>
              </h6>
              <Button className={styles.botaoFinalizarCompra} onClick={handleNegociarVendedor} style={{ marginBottom: "10px" }}>
                Negociar com vendedor
              </Button>
              <Link href={"/finalizarcompra"} onClick={handleClose} className={styles.botaoFinalizarCompra}>
                Finalizar Compra
              </Link>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Carrinho;

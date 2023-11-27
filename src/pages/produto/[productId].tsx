import { useRouter } from "next/router";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import { Card, Col, Row } from "react-bootstrap";
import styles from "./Produto.module.css";
import Image from "next/image";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Produto, ProdutosSimilaresType } from "@/Types/Produto";
import ProdutosSimilares from "@/components/ProdutosSimilares/produtosSimilares";
import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Loading from "@/components/Loading/Loading";
import { format } from "date-fns";
import MyVerticallyCenteredModal from "@/components/AuthModal/ModalAuth/authModal";
import { GetServerSideProps } from "next";
import db from "@/db/db";

function Produto({ produto, produtosSimilares }: { produto: Produto; produtosSimilares: ProdutosSimilaresType[] }) {
  const router = useRouter();
  const [quantidade, setQuantidade] = useState(1);
  const [imagemCarregada, setImagemCarregada] = useState(true);
  const [imagemPrincipal, setImagemPrincipal] = useState(produto.Caminho);
  const { handleAdicionarProdutosAoCarrinho } = useCarrinhoContext();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleImagemErro = () => {
    setImagemCarregada(false);
  };

  const handleQuantidadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedQuantidade = parseInt(event.target.value);
    setQuantidade(selectedQuantidade);
  };

  const handleAdicionarCarrinho = () => {
    if (produto.Estoque <= 0) {
      return toast.warn("Produto indisponível", { pauseOnHover: false });
    } else if (quantidade > produto.Estoque) {
      return toast.warn("Quantidade selecionada maior que o estoque disponível", { pauseOnHover: false });
    } else if (quantidade === 0) {
      return toast.warn("Quantidade selecionada inválida!", { pauseOnHover: false });
    } else {
      const produtoNoCarrinho = {
        ...produto,
        Quantidade: quantidade,
      };

      handleAdicionarProdutosAoCarrinho(produtoNoCarrinho);
    }
  };

  const handleThumbnailClick = (caminho: string | null) => {
    if (caminho) {
      setImagemCarregada(true);
      setImagemPrincipal(caminho);
    }
  };

  return (
    <Container>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Loading />
        </div>
      ) : (
        <>
          {produto && produto.Produto ? (
            <Row>
              <Row>
                <div className={styles.tituloProduto}>
                  <h1>{produto.Produto}</h1>
                  <div className={styles.descricaoTitulo}>
                    <p className={styles.referencia}>Referência: {produto.Referencia}</p>
                    <p className={styles.categoria}>Categoria: {produto.Categoria}</p>
                  </div>
                </div>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={2}>
                  <div className={styles.imagensThumbnail}>
                    {produto.Caminho && (
                      <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho)}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${produto.Caminho}`}
                          alt="Thumbnail 1"
                          width={80}
                          height={80}
                          priority
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // ou 'cover', dependendo do que você precisa
                          }}
                        />
                      </div>
                    )}
                    {produto.Caminho2 && (
                      <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho2)}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${produto.Caminho2}`}
                          alt="Thumbnail 2"
                          width={80}
                          height={80}
                          priority
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // ou 'cover', dependendo do que você precisa
                          }}
                        />
                      </div>
                    )}
                    {produto.Caminho3 && (
                      <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho3)}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${produto.Caminho3}`}
                          alt="Thumbnail 3"
                          width={80}
                          height={80}
                          priority
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // ou 'cover', dependendo do que você precisa
                          }}
                        />
                      </div>
                    )}
                    {produto.Caminho4 && (
                      <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho4)}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${produto.Caminho4}`}
                          alt="Thumbnail 4"
                          width={80}
                          height={80}
                          priority
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // ou 'cover', dependendo do que você precisa
                          }}
                        />
                      </div>
                    )}
                    {produto.Caminho5 && (
                      <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho5)}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${produto.Caminho5}`}
                          alt="Thumbnail 5"
                          width={80}
                          height={80}
                          priority
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // ou 'cover', dependendo do que você precisa
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={12} md={6} lg={4} style={{ marginRight: "40px" }}>
                  {imagemCarregada && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${imagemPrincipal}`}
                      alt="Imagem do produto"
                      width={500}
                      height={500}
                      onError={handleImagemErro}
                      priority
                      style={{
                        maxWidth: "500px",
                        maxHeight: "500px",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain", // ou 'cover', dependendo do que você precisa
                      }}
                    />
                  )}
                </Col>
                <Col xs={12} md={6} lg={5}>
                  <Card>
                    <div className={styles.descricao}>
                      {status === "authenticated" && (
                        <p>
                          Preço:{" "}
                          {produto.Preco1.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      )}

                      {produto.PrecoPromocao && status === "authenticated" && <p>Preço de Promoção: {produto.PrecoPromocao.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</p>}
                      {produto.PromocaoData && status === "authenticated" && <p>Data da Promoção: {format(new Date(produto.PromocaoData), "dd/MM/yyyy")}</p>}
                      {produto.Estoque <= 0 ? <p>Estoque: 😢</p> : <p>Estoque: {produto.Estoque}</p>}
                      {/* Renderize outros detalhes do produto */}
                      {produto.Caracteristicas && (
                        <p>
                          <strong>Características deste produto:</strong> {produto.Caracteristicas}
                        </p>
                      )}

                      {produto.Estoque > 0 ? (
                        <div className={styles.botoesCompra}>
                          <input name="quantidadeProduto" type="number" value={quantidade} min={1} max={produto.Estoque} onChange={handleQuantidadeChange} className={styles.selectInput} />
                          {session?.user?.admin ? (
                            <button disabled className={styles.botaoComprar}>
                              <ShoppingCartIcon style={{ width: "30px", height: "50px", marginRight: "5px" }} />
                              Modo Admin
                            </button>
                          ) : status === "unauthenticated" ? (
                            <>
                              <button onClick={handleOpenLoginModal} className={styles.produtoIndisponivel}>
                                <ShoppingCartIcon style={{ width: "30px", height: "50px", marginRight: "5px" }} />
                                Logue para comprar
                              </button>
                              <MyVerticallyCenteredModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />
                            </>
                          ) : (
                            <button onClick={handleAdicionarCarrinho} className={styles.botaoComprar}>
                              <ShoppingCartIcon style={{ width: "30px", height: "50px", marginRight: "5px" }} />
                              Adicionar ao carrinho
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className={styles.produtoIndisponivel}>Produto Indisponível</div>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row>
                {produtosSimilares.length > 0 && (
                  <div className={styles.produtosSimilares}>
                    <ProdutosSimilares produtos={produtosSimilares} />
                  </div>
                )}
              </Row>
            </Row>
          ) : (
            <Loading />
          )}
        </>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  let produto = {};
  let produtosSimilares: any[] = [];

  if (params?.productId) {
    try {
      // Ajuste conforme o tipo real do ID
      const id = params.productId as string;

      // Consulta para o produto
      const produtos = await db("produto").where("CodPro", id).where("Ecommerce", "X");

      // Consulta para produtos similares
      const produtosSimilaresQuery = await db("Produto_Similar as A")
        .join("Produto as B", "A.CodPro1", "B.CodPro")
        .where("A.CodPro", id)
        .where("B.ECommerce", "X")
        .andWhere(function () {
          this.whereNull("B.Inativo").orWhereNot("B.Inativo", "X");
        })
        .select("B.CodPro", "B.Produto", "B.Preco1", "B.Caminho")
        .orderBy("B.Produto");

      if (produtos.length > 0) {
        produto = JSON.parse(JSON.stringify(produtos[0]));
        produtosSimilares = JSON.parse(JSON.stringify(produtosSimilaresQuery));
      } else {
        // Redireciona para a página inicial se o produto não for encontrado
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    } catch (error) {
      console.error("Erro ao buscar os produtos:", error);
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } else {
    return {
      notFound: true,
    };
  }

  // Retorna as props para o componente Produto
  return {
    props: {
      produto,
      produtosSimilares,
    },
  };
};
export default Produto;

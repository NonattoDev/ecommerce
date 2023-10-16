import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosCliente from "@/services/axiosCliente";
import Container from "react-bootstrap/Container";
import { Card, Col, Row } from "react-bootstrap";
import styles from "./Produto.module.css";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import imagemSubstituicao from "../../../public/fotosProdutos/erro/semProduto.png";
import { Produto, ProdutosSimilaresType, ResponseData } from "@/Types/Produto";
import ProdutosSimilares from "@/components/ProdutosSimilares/produtosSimilares";
import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { useSession } from "next-auth/react";

function Produto() {
  const router = useRouter();
  const { productId } = router.query;
  const [produto, setProduto] = useState<Produto>({} as Produto);
  const [quantidade, setQuantidade] = useState(1);
  const [frete, setFreteGratis] = useState(0);
  const [imagemCarregada, setImagemCarregada] = useState(true);
  const [imagemPrincipal, setImagemPrincipal] = useState("");
  const [produtosSimilares, setProdutosSimilares] = useState<ProdutosSimilaresType[]>([]);
  const { produtosNoCarrinho, handleAdicionarProdutosAoCarrinho } = useCarrinhoContext();
  const { data: session, status } = useSession();

  const handleImagemErro = () => {
    setImagemCarregada(false);
  };

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axiosCliente.get<ResponseData>(`/produtos/produtoEspecifico/${productId}`);
        setProduto(response.data.produto);
        setImagemPrincipal(response.data.produto.Caminho); // Define a primeira imagem como principal ao carregar o produto
        setProdutosSimilares(response.data.produtosSimilares);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduto();
  }, [productId]);

  const handleQuantidadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedQuantidade = parseInt(event.target.value);
    setQuantidade(selectedQuantidade);
  };

  const handleAdicionarCarrinho = () => {
    if (produto.Estoque <= 0) {
      return alert("Produto indisponível");
    } else if (quantidade > produto.Estoque) {
      return alert("Quantidade selecionada maior que o estoque disponível");
    } else {
      const produtoNoCarrinho = {
        ...produto,
        Quantidade: quantidade,
        FreteGratis: frete,
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
    <>
      <Container className={styles.container}>
        {produto && produto.Produto ? (
          <Row>
            <Row>
              <div className={styles.tituloProduto}>
                <h1>{produto.Produto}</h1>
                <div className={styles.descricaoTitulo}>
                  <p className={styles.referencia}>Referência: {produto.Referencia}</p>
                  <p>
                    <Link href={`/categoria/produtos/${produto.Categoria}`} className={styles.link}>
                      Categoria: {produto.Categoria}
                    </Link>
                  </p>
                </div>
              </div>
            </Row>
            <Row>
              <Col sm={2}>
                {produto.Caminho && (
                  <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho)}>
                    <Image src={`/fotosProdutos/${produto.Caminho}`} alt="Thumbnail 2" width={80} height={80} style={{ objectFit: "contain" }} />
                  </div>
                )}

                <div className={styles.imagensThumbnail}>
                  {produto.Caminho2 && (
                    <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho2)}>
                      <Image src={`/fotosProdutos/${produto.Caminho2}`} alt="Thumbnail 2" width={80} height={80} style={{ objectFit: "contain" }} />
                    </div>
                  )}
                  {produto.Caminho3 && (
                    <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho3)}>
                      <Image src={`/fotosProdutos/${produto.Caminho3}`} alt="Thumbnail 3" width={80} height={80} style={{ objectFit: "contain" }} />
                    </div>
                  )}
                  {produto.Caminho4 && (
                    <div className={styles.imagemThumbnail} onClick={() => handleThumbnailClick(produto.Caminho4)}>
                      <Image src={`/fotosProdutos/${produto.Caminho4}`} alt="Thumbnail 3" width={80} height={80} style={{ objectFit: "contain" }} />
                    </div>
                  )}
                  {/* Adicione outros thumbnails aqui */}
                </div>
              </Col>
              <Col>
                {imagemCarregada ? (
                  <Image src={`/fotosProdutos/${imagemPrincipal}`} alt="Imagem do produto" width={500} height={500} onError={handleImagemErro} style={{ objectFit: "contain" }} priority />
                ) : (
                  <Image src={imagemSubstituicao} alt="Imagem de substituição" width={500} height={500} priority />
                )}
              </Col>
              <Col>
                <Card>
                  <div className={styles.descricao}>
                    <p>
                      Preço:{" "}
                      {produto.Preco1.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    {produto.PrecoPromocao && <p>Preço de Promoção: {produto.PrecoPromocao}</p>}
                    {produto.PromocaoData && <p>Data da Promoção: {produto.PromocaoData}</p>}
                    {produto.Estoque <= 0 ? <p>Estoque: 😢</p> : <p>Estoque: {produto.Estoque}</p>}
                    {/* Renderize outros detalhes do produto */}
                    {produto.Caracteristicas && (
                      <p>
                        <strong>Características deste produto:</strong> {produto.Caracteristicas}
                      </p>
                    )}

                    {produto.Estoque > 0 ? (
                      <div className={styles.botoesCompra}>
                        <input type="number" value={quantidade} min={1} max={produto.Estoque} onChange={handleQuantidadeChange} className={styles.selectInput} />
                        {status === "unauthenticated" ? (
                          <button disabled className={styles.produtoIndisponivel}>
                            <ShoppingCartIcon style={{ width: "30px", height: "50px", marginRight: "5px" }} />
                            Logue para comprar
                          </button>
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
          <div>
            <h1>Produto não encontrado</h1>
            {/* Exiba uma mensagem ou redirecione o usuário para uma página de erro */}
          </div>
        )}
      </Container>
    </>
  );
}

export default Produto;

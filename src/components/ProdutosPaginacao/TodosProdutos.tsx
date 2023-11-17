import { useState, useEffect } from "react";
import ProdutoCard from "@/components/Produto/produto";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./TodosProdutos.module.css";
import axios from "axios";

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

export default function MostrarTodosOsProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    obterProdutosPaginados(paginaAtual);
  }, [paginaAtual]);

  const obterProdutosPaginados = async (pagina: number) => {
    try {
      const resposta = await axios.get(`/api/produtos/produtos/?pagina=${pagina}&itensPorPagina=20`);
      const paginas = Math.ceil(resposta.data.qtdProdutos / 20);

      setProdutos(resposta.data.produtos);
      setTotalPaginas(paginas);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaginaSelecionada = (pagina: number) => {
    setPaginaAtual(pagina);
  };

  return (
    <>
      <Container>
        <div className={styles.paginationWrapper}>
          <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} onPageChange={handlePaginaSelecionada} />
        </div>
        <Row xs={1} md={2} lg={3} xl={4} className={`g-4 ${styles.productRow}`}>
          {produtos.map((produto) => (
            <Col key={produto.CodPro}>
              <ProdutoCard
                CodPro={produto.CodPro}
                Produto={produto.Produto}
                Referencia={produto.Referencia}
                Preco1={produto.Preco1}
                PrecoPromocao={produto.PrecoPromocao}
                PromocaoData={produto.PromocaoData}
                Caminho={produto.Caminho}
                Categoria={produto.Categoria}
                Estoque={produto.Estoque}
              />
            </Col>
          ))}
        </Row>
        <div className={styles.paginationWrapper}>
          <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} onPageChange={handlePaginaSelecionada} />
        </div>
      </Container>
    </>
  );
}

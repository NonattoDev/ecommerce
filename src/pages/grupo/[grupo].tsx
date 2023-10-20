import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProdutoCard from "@/components/Produto/produto";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axiosCliente from "@/services/axiosCliente";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./grupo.module.css";
import NavbarSite from "@/components/Navbar/Navbar";
import Carrossel from "@/components/Carrossel/carrossel";

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

export default function Grupo() {
  const router = useRouter();
  const { grupo } = router.query;
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    if (grupo) {
      obterProdutosPaginados(paginaAtual, grupo);
    }
  }, [grupo, paginaAtual]);

  const obterProdutosPaginados = async (pagina: number, grupo) => {
    try {
      const resposta = await axiosCliente.get(`/produtos/grupo/?grupo=${grupo}&pagina=${pagina}&itensPorPagina=20`);

      const paginas = Math.ceil(resposta.data.qtdProdutos / 20);

      setProdutos(resposta.data.produtos);
      setTotalPaginas(paginas);
    } catch (error) {}
  };

  const handlePaginaSelecionada = (pagina: number) => {
    setPaginaAtual(pagina);
  };

  return (
    <>
      <NavbarSite />
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

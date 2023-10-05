import { useState, useEffect } from "react";
import Head from "next/head";
import ProdutoCard from "@/components/Produto/produto";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carrossel from "@/components/Carrossel/carrossel";
import NavbarSite from "@/components/Navbar/Navbar";
import axios from "axios";
import axiosCliente from "@/services/axiosCliente";

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    obterProdutosPaginados(1); // Carrega a página inicial ao carregar o componente
  }, []);

  const obterProdutosPaginados = async (pagina) => {
    try {
      const resposta = await axiosCliente.get(`/produtos?pagina=${pagina}&itensPorPagina=8`);
      setProdutos(resposta.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>E-commerce Soft Line</title>
      </Head>
      <Carrossel />
      <NavbarSite />
      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {produtos.map((produto) => (
            <Col key={produto.id}>
              <ProdutoCard nome={produto.nome} preco={produto.preco} descricao={produto.descricao} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

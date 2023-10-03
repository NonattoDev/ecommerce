import Head from "next/head";
import ProdutoCard from "@/components/Produto/produto";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carrossel from "@/components/Carrossel/carrossel";
import NavbarSite from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>E-commerce Soft Line</title>
      </Head>
      <Carrossel />
      <NavbarSite />
      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          <Col>
            <ProdutoCard nome="Camisa do Brasil" preco={40} descricao="Camisa Linda" />
            <ProdutoCard nome="Camisa do Brasil" preco={40} descricao="Camisa Linda" />
          </Col>
          <Col>
            <ProdutoCard nome="Camisa do Brasil" preco={40} descricao="Camisa Linda" />
            <ProdutoCard nome="Camisa do Brasil" preco={40} descricao="Camisa Linda" />
          </Col>
          <Col>
            <ProdutoCard nome="Camisa do Brasil" preco={40} descricao="Camisa Linda" />
            <ProdutoCard nome="Camisa do Brasil" preco={40} descricao="Camisa Linda" />
          </Col>
          <Col>
            <ProdutoCard nome="Camisa do Brasil" preco={40} descricao="Camisa Linda" />
            <ProdutoCard nome="Camisa do Brasil" preco={40} descricao="Camisa Linda" />
          </Col>
        </Row>
      </Container>
    </>
  );
}

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./cadastroproduto.module.css";
import axios from "axios";
import { useQuery } from "react-query";

interface Product {
  Produto: string;
  Referencia: string;
  CodigoBarras: string;
  Unidade: string;
  Preco1: number;
  Origem: string;
  CstCompra: string;
  Situacao: string;
  CSOSN: string;
  CodSub: string;
  CodGrp: string;
  Estoque1: number;
  EstoqueReservado1: number;
  Caminho: string;
}

const fetchProductCount = async () => {
  const { data } = await axios.get("/api/admin/produtos/contagem"); // Atualize com o caminho correto do seu endpoint
  return data;
};

const CadastroProduto: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    Produto: "",
    Referencia: "",
    CodigoBarras: "",
    Unidade: "",
    Preco1: 0,
    Origem: "",
    CstCompra: "",
    Situacao: "",
    CSOSN: "",
    CodSub: "",
    CodGrp: "",
    Estoque1: 0,
    EstoqueReservado1: 0,
    Caminho: "",
  });

  // Use o React Query para buscar a contagem de produtos
  const { data: productCount, isLoading, error } = useQuery("productCount", fetchProductCount);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Ocorreu um erro: {error.message}</div>;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(product);
    toast.success("Produto cadastrado com sucesso");
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Cadastro de Produto</h1>
          <p>Total de Produtos: {productCount}</p>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={4}>
            <Form.Group controlId="Produto">
              <Form.Label>Nome do Produto</Form.Label>
              <Form.Control type="text" name="Produto" value={product.Produto} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="Referencia">
              <Form.Label>Referência</Form.Label>
              <Form.Control type="text" name="Referencia" value={product.Referencia} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="CodigoBarras">
              <Form.Label>Código de Barras</Form.Label>
              <Form.Control type="text" name="CodigoBarras" value={product.CodigoBarras} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="Unidade">
              <Form.Label>Unidade</Form.Label>
              <Form.Control type="text" name="Unidade" value={product.Unidade} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Preco1">
              <Form.Label>Preço</Form.Label>
              <Form.Control type="number" name="Preco1" value={product.Preco1} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Origem">
              <Form.Label>Origem</Form.Label>
              <Form.Control type="text" name="Origem" value={product.Origem} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="CstCompra">
              <Form.Label>CST de Compra</Form.Label>
              <Form.Control type="text" name="CstCompra" value={product.CstCompra} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Situacao">
              <Form.Label>CST de Venda</Form.Label>
              <Form.Control type="text" name="Situacao" value={product.Situacao} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="CSOSN">
              <Form.Label>CSOSN</Form.Label>
              <Form.Control type="text" name="CSOSN" value={product.CSOSN} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="CodSub">
              <Form.Label>Subgrupo</Form.Label>
              <Form.Control type="text" name="CodSub" value={product.CodSub} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="CodGrp">
              <Form.Label>Grupo</Form.Label>
              <Form.Control type="text" name="CodGrp" value={product.CodGrp} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Estoque1">
              <Form.Label>Estoque</Form.Label>
              <Form.Control type="number" name="Estoque1" value={product.Estoque1} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="EstoqueReservado1">
              <Form.Label>Estoque Reservado</Form.Label>
              <Form.Control type="number" name="EstoqueReservado1" value={product.EstoqueReservado1} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Caminho">
              <Form.Label>URL Imagem</Form.Label>
              <Form.Control type="text" name="Caminho" value={product.Caminho} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            <button type="submit" className={styles.botaoSalvar}>
              <FontAwesomeIcon icon={faSave} cursor={"pointer"} width={30} color="#6EB4D1" />
            </button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CadastroProduto;

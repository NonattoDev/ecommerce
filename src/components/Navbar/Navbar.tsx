import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const axiosCliente = axios.create({
  baseURL: "http://192.168.1.8:3001/",
});

interface Produto {
  CodGrp: number;
  Grupo: string;
  Qtd: number;
}

export default function NavbarSite() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    // Fazendo a chamada de API para obter os produtos
    axiosCliente
      .get("produtos/grupos")
      .then((response) => {
        // Atualiza o estado com os produtos retornados
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao obter os produtos:", error);
        return [];
      });
  }, []);

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark" style={{ width: "100%", height: "40px" }}>
        <Container>
          <Navbar.Brand href="#home">Atl Sul</Navbar.Brand>
          <Nav className="me-auto">
            <NavDropdown title="Categorias" id="navbarScrollingDropdown">
              {produtos.map((produto) => (
                <NavDropdown.Item key={produto.CodGrp} href={`/produtos/${produto.CodGrp}`}>
                  <strong>{produto.Grupo}</strong> - ({produto.Qtd})
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

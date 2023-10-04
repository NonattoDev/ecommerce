import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import axiosCliente from "@/services/axiosCliente";

interface Grupo {
  CodGrp: number;
  Grupo: string;
  Qtd: number;
}

export default function NavbarSite() {
  const [grupo, setGrupo] = useState<Grupo[]>([]);
  const [gruposTop, setGruposTop] = useState<Grupo[]>([]);

  useEffect(() => {
    axios
      .all([axiosCliente.get<Grupo[]>("produtos/grupos"), axiosCliente.get<Grupo[]>("produtos/grupos/top")])
      .then(
        axios.spread((responseGrupos, responseGruposTop) => {
          // Atualiza os estados com os dados retornados
          setGrupo(responseGrupos.data);
          setGruposTop(responseGruposTop.data);
        })
      )
      .catch((error) => {
        console.error("Erro ao obter os grupos:", error);
      });
  }, []);

  return (
    <Navbar data-bs-theme="dark" style={{ width: "100%", height: "50px", backgroundColor: "#017402", fontWeight: "bold" }}>
      <Nav style={{ display: "flex", width: "100%", margin: "0 50px", justifyContent: "space-around" }}>
        <NavDropdown title="Categorias" id="navbarScrollingDropdown">
          {grupo.map((grupo) => (
            <NavDropdown.Item key={grupo.CodGrp} href={`/produtos/${grupo.CodGrp}`}>
              <strong>{grupo.Grupo}</strong> - ({grupo.Qtd})
            </NavDropdown.Item>
          ))}
        </NavDropdown>
        {gruposTop.map((grupo) => (
          <Nav.Link key={grupo.CodGrp}>{grupo.Grupo}</Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
}

// Navbar.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosCliente from "@/services/axiosCliente";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styles from "./navbar.module.css";

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
    <Navbar className="justify-content-center" expand="lg" bg="primary">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Categorias" id="basic-nav-dropdown" className={styles.navDropDown}>
              {grupo.map((grupo) => (
                <NavDropdown.Item key={grupo.CodGrp} href={`/grupo/${grupo.CodGrp}`} className={styles.navDropdownItem}>
                  <strong>{grupo.Grupo}</strong> - ({grupo.Qtd})
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            {gruposTop.map((grupo) => (
              <Nav.Link key={grupo.CodGrp} href={`/grupo/${grupo.CodGrp}`} className={styles.navLink}>
                {grupo.Grupo}
              </Nav.Link>
            ))}
            <NavDropdown.Divider />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

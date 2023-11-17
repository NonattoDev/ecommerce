// Navbar.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styles from "./navbar.module.css";
import { Badge } from "react-bootstrap";
import { set } from "date-fns";

interface Grupo {
  CodGrp: number;
  Grupo: string;
  Qtd: number;
}

export default function NavbarSite() {
  const [grupo, setGrupo] = useState<Grupo[]>([]);
  const [gruposTop, setGruposTop] = useState<Grupo[]>([]);

  useEffect(() => {
    const obterGrupos = async () => {
      try {
        const respostaGruposTop = await axios.get("/api/produtos/topgrupos");

        setGruposTop(respostaGruposTop.data.gruposDeProdutos);
        setGrupo(respostaGruposTop.data.grupos);
      } catch (error) {
        return null;
      }
    };
    obterGrupos();
  }, []);

  return (
    <Navbar expand="lg" className={styles.Navbar} variant="dark">
      <Container>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav style={{ width: "100%", justifyContent: "center" }}>
            <NavDropdown title={<span style={{ color: "#FFF" }}>Categorias</span>} className={styles.navDropDown}>
              {grupo.map((grupo) => (
                <NavDropdown.Item key={grupo.CodGrp} href={`/grupo/${grupo.CodGrp}`} className={styles.navDropdownItem}>
                  <strong>{grupo.Grupo}</strong> - <Badge>({grupo.Qtd})</Badge>
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            {gruposTop.map((grupo) => (
              <Nav.Link key={grupo.CodGrp} href={`/grupo/${grupo.CodGrp}`} className={styles.navLink}>
                {grupo.Grupo}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

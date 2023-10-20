import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import logo from "./logo-progjteo.png";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import Link from "next/link";
import style from "./header.module.css";
import UsuarioOptions from "../UsuarioOptions/usuarioOptions";

function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container fluid>
        <Link href="/">
          <Navbar.Brand style={{ margin: "0px 30px" }}>
            <Image src={logo} alt="Logo" priority width={160} height={70} />
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <div className={style.searchBar}>
            <Form className="d-flex mx-auto">
              <Form.Control autoComplete="false" name="searchEngine" type="search" placeholder="E-commerce Softline Sistemas" className="me-2 form-control-lg textSearch " aria-label="Search" />
            </Form>
          </div>
          <div style={{ margin: "20px" }}>
            <UsuarioOptions />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

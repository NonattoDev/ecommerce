import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import logo from "./logo-progjteo.png";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import Link from "next/link";
import style from "./header.module.css";
import { useState } from "react";
import Carrinho from "../Carrinho/Carrinho";

function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container fluid>
        <Navbar.Brand href="/" style={{ margin: "0px 30px" }}>
          <Image src={logo} alt="Logo" width={160} height={70} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <div className={style.searchBar}>
            <Form className="d-flex mx-auto">
              <Form.Control type="search" placeholder="E-commerce Softline Sistemas" className="me-2 form-control-lg textSearch " aria-label="Search" />
            </Form>
          </div>

          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "250px", margin: "0px 30px", padding: "4px" }}>
            <Link href="/minhaconta" style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "13px", textDecoration: "none" }}>
              <svg style={{ width: "40px", margin: "0 4px 0 0 " }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Entre ou
              <br /> Cadastre-se
            </Link>
            <Carrinho />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

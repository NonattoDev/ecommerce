import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import Link from "next/link";
import style from "./header.module.css";
import UsuarioOptions from "../UsuarioOptions/usuarioOptions";
import SearchBar from "./SearchBar/SearchBar";
import { useSession } from "next-auth/react";
import { useState } from "react";

function Header() {
  const { data: session, status } = useSession();

  return (
    <Navbar expand="lg" style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#F8F6F4" }}>
      <Container>
        <div className={style.logoContainer}>
          <Link href="/">
            <Navbar.Brand>
              <Image src={`${process.env.NEXT_PUBLIC_LOGOMARCA}/logo.png`} alt="Logo" priority width={160} height={70} />
            </Navbar.Brand>
          </Link>
        </div>
        <div className={style.searchBar}>
          <SearchBar />
        </div>
        <div className={style.usuarioOptions}>
          <UsuarioOptions />
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;

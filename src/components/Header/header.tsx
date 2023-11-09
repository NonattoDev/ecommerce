import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import Link from "next/link";
import style from "./header.module.css";
import UsuarioOptions from "../UsuarioOptions/usuarioOptions";
import SearchBar from "./SearchBar/SearchBar";
import { useSession } from "next-auth/react";

function Header() {
  const { data: session, status } = useSession();
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container fluid>
        <Link href="/">
          <Navbar.Brand style={{ margin: "0px 30px" }}>
            <Image src="https://www.atlanticosulcomercio.com.br/image/catalog/logo-atlantico-sul.png" alt="Logo" priority width={160} height={70} />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <div className={style.searchBar}>
            <SearchBar />
          </div>
          <div>{status === "authenticated" && <span style={{ color: "blue", fontSize: "16px" }}>Logado como {session?.user?.cliente}</span>}</div>
          <div>
            <UsuarioOptions />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

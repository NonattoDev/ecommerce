import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import db from "../../db/db";

async function NavbarSite() {
  const gruposDeProdutos = await db.raw(`Select B.CodGrp, A.Grupo, 
    (Select Count(*) From Produto C Where C.CodGrp = B.CodGrp and C.ECommerce = 'X' and (C.Inativo is null or C.Inativo != 'X')) Qtd 
    From Grupo A, Produto B 
    Where B.ECommerce = 'X' and 
         (B.Inativo is null or B.Inativo != 'X') and 
          A.CodGrp = B.CodGrp 
    Group by B.CodGrp, A.Grupo 
    Order by A.Grupo`);

  console.log(gruposDeProdutos);
  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark" style={{ width: "100%", height: "40px" }}>
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#">Home</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarSite;

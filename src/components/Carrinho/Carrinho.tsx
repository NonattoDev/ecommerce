import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./Carrinho.module.css";

function Carrinho() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const itens = [{ nome: "Produto1" }, { nome: "Produto2" }];

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l7-7 3 3-7 7-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3 7 7-3 3-7-7z" />
        </svg>
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Carrinho</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className={styles.itensCarrinho}>
            {itens.map((i) => (
              <p>{i.nome}</p>
            ))}
          </div>

          <h6>
            Resumo do carrinho: <strong>R$:1000,00</strong>
          </h6>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Carrinho;

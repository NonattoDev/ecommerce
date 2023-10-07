import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";

export default function SearchModal({ show, handleClose, handleSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = () => {
    handleSearch(searchTerm);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Realizar Pesquisa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="text" value={searchTerm} onChange={handleChange} placeholder="Digite sua pesquisa" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Pesquisar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

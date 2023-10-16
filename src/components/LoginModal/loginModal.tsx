import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { signIn } from "next-auth/react";
import { Form } from "react-bootstrap";
import styles from "./loginModal.module.css";

export default function MyVerticallyCenteredModal(props) {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setEmailValid(emailValue.includes("@"));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e) => {
    signIn("credentials", {
      email,
      password,
    });

    // Clear the login and password fields
    setEmail("");
    setPassword("");
  };

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Autentique-se</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" value={email} onChange={handleEmailChange} required placeholder="Coloque o seu email" isInvalid={!emailValid} />
            <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Senha:</Form.Label>
            <Form.Control type="password" value={password} onChange={handlePasswordChange} required placeholder="Coloque a sua senha!" />
          </Form.Group>
          <Button variant="primary" onClick={handleFormSubmit} style={{ marginTop: "10px" }}>
            Entrar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

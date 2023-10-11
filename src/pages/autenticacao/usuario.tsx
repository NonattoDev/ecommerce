import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from "./Usuario.module.css";

function Usuario() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica de autenticação
    console.log("Login realizado:", email, senha);
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    // Lógica de cadastro de cliente
    console.log("Cliente cadastrado:", email, senha);
  };

  const handleRecuperarSenha = (e) => {
    e.preventDefault();
    // Lógica de recuperação de senha
    console.log("Senha recuperada para:", email);
  };

  return (
    <Form className={styles.form}>
      <Form.Group className={styles.formGroup} controlId="formBasicEmail">
        <Form.Label className={styles.label}>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
      </Form.Group>

      <Form.Group className={styles.formGroup} controlId="formBasicPassword">
        <Form.Label className={styles.label}>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={senha} onChange={(e) => setSenha(e.target.value)} className={styles.input} />
      </Form.Group>

      <Button variant="primary" type="submit" onClick={handleLogin} className={styles.button}>
        Login
      </Button>

      <Button variant="secondary" type="submit" onClick={handleCadastro} className={styles.button}>
        Cadastro
      </Button>

      <Button variant="link" type="submit" onClick={handleRecuperarSenha} className={styles.button}>
        Recuperar Senha
      </Button>
    </Form>
  );
}

export default Usuario;

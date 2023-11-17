import React, { ChangeEvent, FormEvent, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { FloatingLabel } from "react-bootstrap";
import axios from "axios";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      return toast.info("Informe um email!");
    }

    axios
      .post("/api/usuario/recuperarsenha", { email })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Email de recuperação enviado, cheque seu email :)");
          setEmail("");
        }
      })
      .catch((err) => {
        toast.warn(err.response.data.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="email">
        <FloatingLabel controlId="email" label="Digite um email para recuperação">
          <Form.Control autoComplete="true" type="email" name="email" value={email} onChange={handleChange} />
        </FloatingLabel>
      </Form.Group>
      <Button variant="primary" type="submit" style={{ marginTop: "10px" }}>
        Enviar
      </Button>
    </Form>
  );
};

export default ForgotPasswordForm;

import React, { ChangeEvent, FormEvent, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import axiosCliente from "@/services/axiosCliente";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axiosCliente
      .post("/usuarios/recuperar-senha", { email })
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
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={email} onChange={handleChange} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Enviar
      </Button>
    </Form>
  );
};

export default ForgotPasswordForm;

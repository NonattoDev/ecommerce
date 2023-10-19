import { useState } from "react";
import Button from "react-bootstrap/Button";
import { signIn } from "next-auth/react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import style from "./loginForm.module.css";
import { useCarrinhoContext } from "@/context/CarrinhoContext";
import axios from "axios";

export default function LoginForm() {
  const { fetchCarrinho } = useCarrinhoContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Obtenha o endereço IP do usuário no lado do servidor
    const response = axios
      .get("https://api.ipify.org?format=json")
      .then((result) => {
        const ip = result.data.ip;
        signIn("credentials", {
          email,
          password,
          ip,
          callbackUrl: "/",
          redirect: false,
        })
          .then((response) => {
            if (response?.status === 200) {
              toast.success("Logado com sucesso!");
              fetchCarrinho();
            }
            if (response?.status === 401) {
              toast.warn("Verifique as credenciais!");
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })
      .catch((err) => {
        toast.warn(err.message);
      });
  };

  return (
    <Form>
      <Form.Group controlId="email">
        <div className={style.inputGroup}>
          <Form.Label className={style.label}>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={handleEmailChange} required placeholder="email@exemplo.com" />
        </div>
        <Form.Control.Feedback type="invalid">Por favor, entre um email válido!</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="password">
        <div className={style.inputGroup}>
          <Form.Label className={style.label}>Senha</Form.Label>
          <Form.Control type="password" value={password} onChange={handlePasswordChange} required placeholder="*********" />
        </div>
      </Form.Group>
      <div className="text-center">
        <Button variant="primary" onClick={handleFormSubmit}>
          Entrar
        </Button>
      </div>
    </Form>
  );
}

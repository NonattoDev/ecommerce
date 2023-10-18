import { useState } from "react";
import Button from "react-bootstrap/Button";
import { signIn } from "next-auth/react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import style from "./loginForm.module.css";
import { useCarrinhoContext } from "@/context/CarrinhoContext";

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
    signIn("credentials", {
      email,
      password,
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

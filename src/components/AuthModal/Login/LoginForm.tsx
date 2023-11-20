import { useState } from "react";
import Button from "react-bootstrap/Button";
import { getSession, signIn } from "next-auth/react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import style from "./loginForm.module.css";
import { useCarrinhoContext } from "@/context/CarrinhoContext";
import axios from "axios";
import Loading from "@/components/Loading/Loading";

export default function LoginForm() {
  const [loading, setLoading] = useState(false); // Estado para controlar o indicador de carregamento
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
    setLoading(true); // Ativa o indicador de carregamento

    // Obtenha o endereço IP do usuário no lado do servidor
    const response = axios
      .get("https://api.ipify.org?format=json")
      .then((result) => {
        const ip = result.data.ip;
        signIn("credentials", {
          email,
          password,
          ip,
          callbackUrl: process.env.VERCEL_URL,
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
          })
          .finally(() => {
            getSession().then((res) => {});

            setLoading(false); // Desativa o indicador de carregamento quando a resposta é recebida
          });
      })
      .catch((err) => {
        toast.warn(err.message);
        setLoading(false); // Desativa o indicador de carregamento em caso de erro
      });
  };

  return (
    <Form>
      <Form.Group controlId="emailLogin">
        <div className={style.inputGroup}>
          <Form.Label className={style.label}>Email</Form.Label>
          <Form.Control name="emailLogin" autoComplete="true" type="email" value={email} onChange={handleEmailChange} required placeholder="email@exemplo.com" />
        </div>
        <Form.Control.Feedback type="invalid">Por favor, entre um email válido!</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="passwordLogin">
        <div className={style.inputGroup}>
          <Form.Label className={style.label}>Senha</Form.Label>
          <Form.Control autoComplete="true" name="passwordLogin" type="password" value={password} onChange={handlePasswordChange} required placeholder="*********" />
        </div>
      </Form.Group>
      <div className="text-center">
        {loading ? (
          <Loading />
        ) : (
          <Button type="submit" variant="primary" onClick={handleFormSubmit}>
            Entrar
          </Button>
        )}
      </div>
    </Form>
  );
}

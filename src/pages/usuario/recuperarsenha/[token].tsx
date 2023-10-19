import axiosCliente from "@/services/axiosCliente";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function PasswordReset() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (typeof token !== "undefined") {
          const response = await axiosCliente.post(`/usuarios/recuperar-senha/${token}`);
          if (response.status === 200) {
            setTokenValid(true);
          }
        }
      } catch (error: any) {
        if (error.response.status === 401) {
          setTokenValid(false);
        }
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) return toast.error("As senhas precisam ser iguais.");
      if (password.length <= 0 || password.length < 8) return toast.info("A senha precisa ter ao menos 8 digitos!");
      const response = await axiosCliente.post(`/usuarios/alterarsenha/`, { token, password });
      if (response.status === 200) {
        toast.success(response.data);
        setPassword("");
        setConfirmPassword("");
        router.push("/");
      }
    } catch (error) {
      toast.warn("Ocorreu um erro ao processar a solicitação!", { autoClose: 2000 });
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "600px" }}>
        <Card.Body>
          {tokenValid ? (
            <>
              <Card.Title style={{ borderBottom: "1px solid #ccc" }}>
                <h1>Escolha uma nova senha</h1>
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formPassword">
                  <Form.Label style={{ fontWeight: "bold" }}>Nova senha</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={true} />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword" style={{ marginTop: "10px" }}>
                  <Form.Label style={{ fontWeight: "bold" }}>Confirmar senha:</Form.Label>
                  <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={true} />
                </Form.Group>
                <Button type="submit" style={{ marginTop: "20px" }}>
                  Redefinir senha
                </Button>
              </Form>
            </>
          ) : (
            <p>TOKEN INVÁLIDO</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

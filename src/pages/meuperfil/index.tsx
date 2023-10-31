import { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const MeuPerfil = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated") {
    toast.warn("Você não está autenticado");
    useRouter().push("/");
  }

  const handleSubmit = () => {
    // Faça a lógica de atualização aqui
    console.log(`Nome: ${nome}, Email: ${email}, Senha: ${senha}`);
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>
            Meu Perfil <FontAwesomeIcon icon={faUser} style={{ background: "none", border: "none", cursor: "pointer", color: "blue", width: "30px" }} />
          </h2>
          <Form>
            <Form.Group controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" placeholder="Digite seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formSenha">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </Form.Group>

            <Button variant="primary" onClick={handleSubmit}>
              Atualizar <FontAwesomeIcon icon={faRefresh} style={{ background: "none", border: "none", cursor: "pointer", color: "blue", width: "30px" }} />
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MeuPerfil;

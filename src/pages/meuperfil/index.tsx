import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { getSession, useSession } from "next-auth/react";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import db from "@/db/db";
import { GetServerSideProps } from "next";
import moment from "moment";

const MeuPerfil = ({ dadosDoCliente }: any) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.warn("Você não está autenticado");
      router.push("/");
    },
  });

  if (status === "loading") return <Loading />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de atualização aqui.
    toast("Atualizado com sucesso!");
  };

  return (
    <Container>
      <h2>
        <FontAwesomeIcon icon={faUser} style={{ width: "30px", color: "blue" }} />
        Meu Perfil
      </h2>
      <Col md={2}>
        <Row>
          <Form.Group controlId="formCodCli">
            <Form.Label>Código do Cliente</Form.Label>
            <Form.Control type="text" placeholder="Código do Cliente" value={session?.user?.id} readOnly disabled style={{ width: "70px", textAlign: "center" }} />
          </Form.Group>
        </Row>
      </Col>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formCliente">
              <Form.Label>Cliente</Form.Label>
              <Form.Control type="text" placeholder="Nome do cliente" value={dadosDoCliente.Cliente} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formRazao">
              <Form.Label>Razão Social</Form.Label>
              <Form.Control type="text" placeholder="Razão Social" value={dadosDoCliente.Razao} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formComplemento">
              <Form.Label>Complemento</Form.Label>
              <Form.Control type="text" placeholder="Complemento" value={dadosDoCliente.Complemento} readOnly />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEMail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={dadosDoCliente.EMail} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCGC">
              <Form.Label>CNPJ</Form.Label>
              <Form.Control type="text" placeholder="CNPJ" value={dadosDoCliente.CGC} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formIE">
              <Form.Label>IE</Form.Label>
              <Form.Control type="text" placeholder="IE" value={dadosDoCliente.IE} readOnly />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formTelEnt">
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="text" placeholder="Telefone" value={dadosDoCliente.TelEnt} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formDataCad">
              <Form.Label>Data Cadastro</Form.Label>
              <Form.Control type="text" placeholder="Data Cadastro" value={moment(dadosDoCliente.DataCad).format("DD/MM/YYYY")} readOnly />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEndereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control type="text" placeholder="Endereço" value={dadosDoCliente.Endereco} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formBairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control type="text" placeholder="Bairro" value={dadosDoCliente.Bairro} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control type="text" placeholder="Cidade" value={dadosDoCliente.Cidade} readOnly />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control type="text" placeholder="Estado" value={dadosDoCliente.Estado} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCep">
              <Form.Label>Cep</Form.Label>
              <Form.Control type="text" placeholder="Cep" value={dadosDoCliente.Cep} readOnly />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" style={{ margin: "10px 0 10px 0" }}>
          Atualizar <FontAwesomeIcon icon={faRefresh} style={{ width: "30px" }} />
        </Button>
      </Form>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        dadosDoCliente: null,
      },
    };
  }

  let dadosCliente = await db("clientes")
    .select(
      "CodCli",
      "Cliente",
      "Razao",
      "Complemento",
      "CodSeg",
      "Endereco",
      "Bairro",
      "Cidade",
      "Estado",
      "Cep",
      "TelEnt",
      "CGC",
      "IE",
      "DataCad",
      "Situacao",
      "Tipo",
      "EMail",
      "CodCliMega",
      "NireSede",
      "Edificacao",
      "Uso",
      "UnidadeImobiliaria",
      "Valor"
    )
    .where("CodCli", session.user.id);

  dadosCliente = dadosCliente.map((cliente) => {
    // Converter todas as instâncias de Date para strings.
    for (const key in cliente) {
      if (cliente[key] instanceof Date) {
        cliente[key] = cliente[key].toISOString();
      }
    }
    return cliente;
  });

  return {
    props: {
      dadosDoCliente: dadosCliente[0] || null,
    },
  };
};

export default MeuPerfil;

import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { getSession, useSession } from "next-auth/react";

import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import db from "@/db/db";
import { GetServerSideProps } from "next";

const MeuPerfil = ({ dadosDoCliente }: any) => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated") {
    toast.warn("Você não está autenticado");
    useRouter().push("/");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de atualização aqui.
  };

  return (
    <Container>
      <h2>
        Meu Perfil <FontAwesomeIcon icon={faUser} style={{ width: "30px" }} />
      </h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formCliente">
              <Form.Label>Cliente</Form.Label>
              <Form.Control type="text" placeholder="Nome do cliente" value={dadosDoCliente.Cliente} onChange={(e) => setNome(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formRazao">
              <Form.Label>Razão Social</Form.Label>
              <Form.Control type="text" placeholder="Razão Social" value={dadosDoCliente.Razao} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formComplemento">
              <Form.Label>Complemento</Form.Label>
              <Form.Control type="text" placeholder="Complemento" value={dadosDoCliente.Complemento} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="formCodSeg">
              <Form.Label>Código de Segurança</Form.Label>
              <Form.Control type="number" placeholder="Código de Segurança" value={dadosDoCliente.CodSeg} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formEndereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control type="text" placeholder="Endereço" value={dadosDoCliente.Endereco} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formBairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control type="text" placeholder="Bairro" value={dadosDoCliente.Bairro} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formCidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control type="text" placeholder="Cidade" value={dadosDoCliente.Cidade} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control type="text" placeholder="Estado" value={dadosDoCliente.Estado} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCep">
              <Form.Label>Cep</Form.Label>
              <Form.Control type="text" placeholder="Cep" value={dadosDoCliente.Cep} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formTelEnt">
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="text" placeholder="Telefone" value={dadosDoCliente.TelEnt} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCGC">
              <Form.Label>CNPJ</Form.Label>
              <Form.Control type="text" placeholder="CNPJ" value={dadosDoCliente.CGC} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formIE">
              <Form.Label>IE</Form.Label>
              <Form.Control type="text" placeholder="IE" value={dadosDoCliente.IE} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formDataCad">
              <Form.Label>Data Cadastro</Form.Label>
              <Form.Control type="date" placeholder="Data Cadastro" value={dadosDoCliente.DataCad} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formSituacao">
              <Form.Label>Situação</Form.Label>
              <Form.Control type="text" placeholder="Situação" value={dadosDoCliente.Situacao} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formTIPO">
              <Form.Label>TIPO</Form.Label>
              <Form.Control type="text" placeholder="TIPO" value={dadosDoCliente.TIPO} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEMail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={dadosDoCliente.EMail} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCodCliMega">
              <Form.Label>CodCliMega</Form.Label>
              <Form.Control type="text" placeholder="CodCliMega" value={dadosDoCliente.CodCliMega} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formNireSede">
              <Form.Label>NireSede</Form.Label>
              <Form.Control type="text" placeholder="NireSede" value={dadosDoCliente.NireSede} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEdificacao">
              <Form.Label>Edificacao</Form.Label>
              <Form.Control type="text" placeholder="Edificacao" value={dadosDoCliente.Edificacao} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formUso">
              <Form.Label>Uso</Form.Label>
              <Form.Control type="text" placeholder="Uso" value={dadosDoCliente.Uso} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formUnidadeImobiliaria">
              <Form.Label>UnidadeImobiliaria</Form.Label>
              <Form.Control type="text" placeholder="UnidadeImobiliaria" value={dadosDoCliente.UnidadeImobiliaria} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formValor">
              <Form.Label>Valor</Form.Label>
              <Form.Control type="text" placeholder="Valor" value={dadosDoCliente.Valor} />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
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

  // Certifique-se de que dadosCliente é um objeto ou array como esperado.
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

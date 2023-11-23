import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import moment from "moment";
import { useState } from "react";
import axios from "axios";
import styles from "./clientes.module.css";
import InputMask from "react-input-mask";
import { GrUpdate } from "react-icons/gr";
import { IoPersonCircleSharp } from "react-icons/io5";

interface Cliente {
  CodCli?: number;
  Cliente?: string;
  Razao?: string;
  Complemento?: string;
  EMail?: string;
  CGC?: string;
  IE?: string;
  TelEnt?: string;
  DataCad?: string;
  Endereco?: string;
  Bairro?: string;
  Cidade?: string;
  Estado?: string;
  Cep?: string;
}

const Clientes = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.warn("Você não está autenticado");
      router.push("/");
    },
  });
  const [dadosDoCliente, setDadosDoCliente] = useState<Cliente>({} as Cliente);

  if (status === "loading") return <Loading />;

  if (status === "authenticated" && !session?.user?.admin) {
    toast.warn("Você não está autorizado a acessar esta página");
    router.push("/painel/admin");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosDoCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de atualização aqui.
    await axios.put(`/api/admin/clientes/${dadosDoCliente.CodCli}`, dadosDoCliente);
    toast("Atualizado com sucesso!");
  };

  const handleFetchCliente = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Se o campo estiver vazio, define o CodCli como 0
    const codCliValue = e.target.value === "" ? "0" : e.target.value;
    setDadosDoCliente((prevState) => ({
      ...prevState,
      CodCli: parseInt(codCliValue, 10) || 0,
    }));

    if (codCliValue !== "0") {
      try {
        const response = await axios.get(`/api/admin/clientes/${codCliValue}`);
        if (response?.data) {
          setDadosDoCliente(response.data);
        }
      } catch (error) {
        toast.error("Erro ao buscar os dados do cliente.");
      }
    }
  };

  return (
    <Container>
      <h2 className={styles.Title}>
        <IoPersonCircleSharp size={35} style={{ color: "#0D6EFD" }} />
        Atualizar dados do Cliente
      </h2>
      <Col md={2}>
        <Row>
          <Form.Group controlId="formCodCli">
            <Form.Label className={styles["form-label"]}>Código do Cliente</Form.Label>
            <Form.Control type="text" placeholder="Código do Cliente" value={dadosDoCliente.CodCli} style={{ width: "70px", textAlign: "center" }} onChange={handleFetchCliente} />
          </Form.Group>
        </Row>
      </Col>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formCliente">
              <Form.Label className={styles["form-label"]}>Cliente</Form.Label>
              <Form.Control name="Cliente" type="text" placeholder="Nome do cliente" value={dadosDoCliente.Cliente} onChange={handleChange} disabled />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formRazao">
              <Form.Label className={styles["form-label"]}>Razão Social</Form.Label>
              <Form.Control name="Razao" type="text" placeholder="Razão Social" value={dadosDoCliente.Razao} onChange={handleChange} disabled />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formComplemento">
              <Form.Label className={styles["form-label"]}>Complemento</Form.Label>
              <Form.Control name="Complemento" type="text" placeholder="Complemento" value={dadosDoCliente.Complemento} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEMail">
              <Form.Label className={styles["form-label"]}>Email</Form.Label>
              <Form.Control
                name="EMail"
                type="email"
                placeholder="Email"
                value={dadosDoCliente.EMail}
                onChange={handleChange}
                className="form-control" // Classe de estilo do Bootstrap
                required // Opcional: Adiciona uma validação HTML5 que exige que o campo seja preenchido
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" // Opcional: Adiciona uma validação de padrão para o email
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCGC">
              <Form.Label className={styles["form-label"]}>CNPJ</Form.Label>
              <Form.Control type="text" placeholder="CNPJ" value={dadosDoCliente.CGC} disabled />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formIE">
              <Form.Label className={styles["form-label"]}>IE</Form.Label>
              <Form.Control name="IE" type="text" placeholder="IE" value={dadosDoCliente.IE} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formTelEnt">
              <Form.Label className={styles["form-label"]}>Telefone</Form.Label>
              <Form.Control
                as={InputMask}
                mask="(99)99999-9999"
                name="TelEnt"
                type="text"
                placeholder="Telefone"
                value={dadosDoCliente.TelEnt}
                onChange={handleChange}
                className="form-control" // Classe de estilo do Bootstrap
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formDataCad">
              <Form.Label className={styles["form-label"]}>Data Cadastro</Form.Label>
              <Form.Control disabled type="text" placeholder="Data Cadastro" value={moment(dadosDoCliente.DataCad).format("DD/MM/YYYY")} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEndereco">
              <Form.Label className={styles["form-label"]}>Endereço</Form.Label>
              <Form.Control name="Endereco" type="text" placeholder="Endereço" value={dadosDoCliente.Endereco} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formBairro">
              <Form.Label className={styles["form-label"]}>Bairro</Form.Label>
              <Form.Control name="Bairro" type="text" placeholder="Bairro" value={dadosDoCliente.Bairro} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCidade">
              <Form.Label className={styles["form-label"]}>Cidade</Form.Label>
              <Form.Control name="Cidade" type="text" placeholder="Cidade" value={dadosDoCliente.Cidade} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEstado">
              <Form.Label className={styles["form-label"]}>Estado</Form.Label>
              <Form.Control name="Estado" type="text" placeholder="Estado" value={dadosDoCliente.Estado} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCep">
              <Form.Label className={styles["form-label"]}>Cep</Form.Label>
              <Form.Control
                as={InputMask}
                mask="99999-999"
                name="Cep"
                type="text"
                placeholder="Cep"
                value={dadosDoCliente.Cep}
                onChange={handleChange}
                className="form-control" // Classe de estilo do Bootstrap
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Button variant="primary" type="submit" className={styles.ButtonSubmit}>
            <GrUpdate />
          </Button>
        </Row>
      </Form>
    </Container>
  );
};

export default Clientes;

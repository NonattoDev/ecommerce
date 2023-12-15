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
import styles from "./MeuPerfil.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import InputMask from "react-input-mask";

const MeuPerfil = ({ dadosDoCliente }: any) => {
  const [dadosCliente, setDadosCliente] = useState(dadosDoCliente);

  useEffect(() => {
    // Atualiza o estado sempre que os dados do cliente mudam
    setDadosCliente(dadosDoCliente);
  }, [dadosDoCliente]);

  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.warn("Você não está autenticado");
      router.push("/");
    },
  });

  if (status === "loading") return <Loading />;

  if (status === "authenticated" && session?.user?.admin) {
    toast.warn("A página meu perfil é restrita para clientes, utilize o painel de ADMIN");
    router.push("/painel/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dadosCliente.EMail) return toast.error("O campo email é obrigatório!");
    if (!dadosCliente.IE) return toast.error("O campo IE é obrigatório!");
    if (!dadosCliente.Cep) return toast.error("O campo CEP é obrigatório!");
    if (dadosCliente.Cep.length < 8) return toast.error("O campo CEP deve conter 8 dígitos!");
    if (!dadosCliente.Bairro) return toast.error("O campo Bairro é obrigatório!");
    if (!dadosCliente.Cidade) return toast.error("O campo Cidade é obrigatório!");
    if (!dadosCliente.Estado) return toast.error("O campo Estado é obrigatório!");
    if (!dadosCliente.Endereco) return toast.error("O campo Endereço é obrigatório!");

    // Atualiza os dados do cliente no banco de dados
    const resposta = await axios.put("/api/usuario/alterarenderecoperfil", dadosCliente);

    if (resposta.data.error) return toast.error(resposta.data.error);

    toast.success("Atualizado com sucesso!");
  };

  // Função para lidar com mudanças nos inputs
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { value } = e.target;
    // Atualiza o estado com os novos valores
    setDadosCliente((prevState: any) => ({
      ...prevState,
      [field]: value,
    }));

    if (field === "Cep") {
      // Remove caracteres que não são dígitos
      const cepFormatado = value.replace(/\D/g, "");
      if (cepFormatado.length >= 8) {
        try {
          const resposta = await axios.get(`https://viacep.com.br/ws/${cepFormatado}/json/`);

          if (!resposta.data.erro) {
            setDadosCliente((prevState: any) => ({
              ...prevState,
              Cep: resposta.data.cep,
              Endereco: resposta.data.logradouro,
              Bairro: resposta.data.bairro,
              Cidade: resposta.data.localidade,
              Estado: resposta.data.uf,
            }));
          } else {
            // CEP não encontrado
            toast.error("CEP não encontrado.");
          }
        } catch (error) {
          // Tratamento de erro da chamada da API
          toast.error("Erro ao buscar o CEP.");
        }
      }
    }
  };

  return (
    <Container className={styles.Container}>
      <h2>
        <FontAwesomeIcon icon={faUser} style={{ width: "30px", color: "blue" }} />
        Meu Perfil
      </h2>
      <Col md={2}>
        <Row>
          <Form.Group controlId="formCodCli">
            <Form.Label>Código do Cliente</Form.Label>
            <Form.Control type="text" placeholder="Código do Cliente" defaultValue={session?.user?.id} readOnly disabled style={{ width: "70px", textAlign: "center" }} />
          </Form.Group>
        </Row>
      </Col>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formCliente">
              <Form.Label>Cliente</Form.Label>
              <Form.Control type="text" placeholder="Nome do cliente" value={dadosDoCliente.Cliente} readOnly disabled />
            </Form.Group>
          </Col>
          {!dadosDoCliente.CPF && (
            <Col md={4}>
              <Form.Group controlId="formRazao">
                <Form.Label>Razão Social</Form.Label>
                <Form.Control type="text" placeholder="Razão Social" value={dadosDoCliente.Razao} readOnly disabled />
              </Form.Group>
            </Col>
          )}
          <Col md={4}>
            <Form.Group controlId="formComplemento">
              <Form.Label>Origem</Form.Label>
              <Form.Control type="text" placeholder="Complemento" value={dadosDoCliente.Complemento} readOnly disabled />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEMail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={dadosCliente.EMail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "EMail")} />
            </Form.Group>
          </Col>
          {dadosDoCliente.CPF ? (
            <>
              <Col md={4}>
                <Form.Group controlId="formCPF">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control type="text" placeholder="CPF" value={dadosDoCliente.CPF} readOnly disabled />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formRG">
                  <Form.Label>RG</Form.Label>
                  <Form.Control type="text" placeholder="cpf" value={dadosCliente.RG} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "cpf")} />
                </Form.Group>
              </Col>
            </>
          ) : (
            <>
              <Col md={4}>
                <Form.Group controlId="formCGC">
                  <Form.Label>CNPJ</Form.Label>
                  <Form.Control type="text" placeholder="CNPJ" value={dadosDoCliente.CGC} readOnly disabled />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formIE">
                  <Form.Label>IE</Form.Label>
                  <Form.Control type="text" placeholder="IE" value={dadosCliente.IE} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "IE")} />
                </Form.Group>
              </Col>
            </>
          )}
          <Col md={4}>
            <Form.Group controlId="formDataCad">
              <Form.Label>Data Cadastro</Form.Label>
              <Form.Control type="text" placeholder="Data Cadastro" value={moment(dadosDoCliente.DataCad).format("DD/MM/YYYY")} readOnly disabled />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formCep">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                as={InputMask}
                mask="99999-999"
                maskChar={null}
                type="text"
                placeholder="CEP"
                value={dadosCliente.Cep}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "Cep")}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formBairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control type="text" placeholder="Bairro" value={dadosCliente.Bairro} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "Bairro")} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control type="text" placeholder="Cidade" value={dadosCliente.Cidade} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "Cidade")} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control type="text" placeholder="Estado" value={dadosCliente.Estado} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "Estado")} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formEndereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control type="text" placeholder="Endereço" value={dadosCliente.Endereco} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "Endereco")} />
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
      redirect: {
        destination: "/",
        permanent: false,
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
      "CPF",
      "RG",
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

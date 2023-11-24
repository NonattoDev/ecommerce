import React from "react";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTable, faUserCheck, faPlus, faPencil, faGear } from "@fortawesome/free-solid-svg-icons";
import styles from "./admin.module.css"; // Adicionando um arquivo de estilos separado
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loading from "@/components/Loading/Loading";
import Clientes from "./clientes/clientes";
import Dashboard from "./dashboard/dashboard";
import CadastroProduto from "./cadastroproduto/cadastroproduto";
import EdicaoProduto from "./edicaoproduto/EdicaoProduto";
import Configuracoes from "./configurarportal/configuracoes";

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.warn("Você não está autenticado");
      router.push("/");
      return;
    },
  });

  if (status === "loading") return <Loading />;

  if (session?.user?.admin === false) {
    toast.warn("Você não está autorizado a acessar esta página");
    router.push("/");
    return;
  }

  return (
    <Container fluid>
      <Tab.Container defaultActiveKey="analise">
        <Row>
          <Col xs={12} sm={6} md={6} lg={1} xl={1}>
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="home" href="/">
                  <FontAwesomeIcon icon={faHouse} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analise" className={styles["nav-item-spacing"]}>
                  <FontAwesomeIcon icon={faTable} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="clientes">
                  <FontAwesomeIcon icon={faUserCheck} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="cadastroProduto">
                  <FontAwesomeIcon icon={faPlus} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="edicaoproduto">
                  <FontAwesomeIcon icon={faPencil} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="configurarportal">
                  <FontAwesomeIcon icon={faGear} className={styles.icon} />
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xs={12} sm={12} md={12} lg={10} xl={10}>
            <Tab.Content>
              <Tab.Pane eventKey="analise">
                <Dashboard />
              </Tab.Pane>
              <Tab.Pane eventKey="clientes">
                <Clientes />
              </Tab.Pane>
              <Tab.Pane eventKey="cadastroProduto">
                <CadastroProduto />
              </Tab.Pane>
              <Tab.Pane eventKey="edicaoproduto">
                <EdicaoProduto />
              </Tab.Pane>
              <Tab.Pane eventKey="configurarportal">
                <Configuracoes />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminPage;

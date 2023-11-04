import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartLine, faTable, faTh, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "./admin.module.css"; // Adicionando um arquivo de estilos separado
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loading from "@/components/Loading/Loading";

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
      <Row>
        <Col className={`${styles.sidebar} bg-light min-vh-100 d-flex flex-column align-items-center pt-3`}>
          {/* Sidebar */}
          <Nav className="flex-column w-100" variant="tabs" defaultActiveKey="/">
            <Nav.Item>
              <Nav.Link href="/" eventKey="link-1" className={styles["nav-item-spacing"]}>
                <FontAwesomeIcon icon={faHouse} className={styles.icon} />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/analytics" eventKey="link-2" className={styles["nav-item-spacing"]}>
                <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/table" eventKey="link-3" className={styles["nav-item-spacing"]}>
                <FontAwesomeIcon icon={faTable} className={styles.icon} />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/applications" eventKey="link-4" className={styles["nav-item-spacing"]}>
                <FontAwesomeIcon icon={faTh} className={styles.icon} />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/user" eventKey="link-5" className={styles["nav-item-spacing"]}>
                <FontAwesomeIcon icon={faUserCircle} className={styles.icon} />
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={11}>
          {/* Aqui vai o conteúdo da página */}
          Conteúdo da página
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;

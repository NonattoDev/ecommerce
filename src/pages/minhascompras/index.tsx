import Loading from "@/components/Loading/Loading";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Container, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import db from "@/db/db";
import { GetServerSideProps } from "next";
import Link from "next/link";
import moment from "moment";
import styles from "./minhasCompras.module.css";

const MinhasCompras = ({ comprasDoCliente }: any) => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated") {
    toast.warn("Você não está autenticado");
    useRouter().push("/");
  }

  return (
    <Container className={styles.container} style={{ marginTop: "20px" }}>
      <h3 style={{ textAlign: "center" }}>Página de Compras do usuário</h3>
      {comprasDoCliente ? (
        comprasDoCliente.map((compra: any) => (
          <Link href={`/minhascompras/compra/${compra.Pedido}`} className={styles.cardLink}>
            <Card key={compra.Pedido} className={styles.card}>
              <Card.Body>
                <Card.Title>Compra #{compra.Pedido}</Card.Title>
                <Card.Text>Status: {compra.StatusPagamento}</Card.Text>
                <Card.Text>Data: {moment(compra.Data1).format("DD/MM/YYYY")}</Card.Text>
                {/* Adicione outros detalhes da compra, se necessário */}
              </Card.Body>
            </Card>
          </Link>
        ))
      ) : (
        <p>Nenhuma compra encontrada.</p>
      )}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        comprasDoCliente: null,
      },
    };
  }

  let comprasDoCliente = await db("requisi").select("Pedido", "StatusPagamento", "Data1").where("CodCli", session.user.id);
  comprasDoCliente = comprasDoCliente.map((compra) => {
    // Converter todas as instâncias de Date para strings.
    for (const key in compra) {
      if (compra[key] instanceof Date) {
        compra[key] = compra[key].toISOString();
      }
    }
    return compra;
  });

  return {
    props: {
      comprasDoCliente: comprasDoCliente || null,
    },
  };
};

export default MinhasCompras;

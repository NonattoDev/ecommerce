import Loading from "@/components/Loading/Loading";
import db from "@/db/db";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { Container, Row, Col, Card } from "react-bootstrap";

const CompraEspecifica = ({ CompraEspecifica }: any) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.warn("Você não está autenticado");
      router.push("/");
    },
  });

  if (status === "loading") return <Loading />;

  const { chargeid } = useRouter().query;

  return (
    <>
      <style type="text/css">
        {`
          .card-hover:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease-in-out;
          }
        `}
      </style>
      <Container>
        <h1>Compra #{chargeid}</h1>
        {CompraEspecifica ? (
          <Row
            xs={1}
            md={2}
            lg={5}
            className="g-4"
            style={{ marginBottom: "1rem" }} // Adiciona a margem no fundo de cada card
          >
            {CompraEspecifica.map((compra: any) => (
              <Col key={compra.Pedido}>
                <Card className="h-100 shadow-sm card-hover">
                  <Card.Body>
                    <Card.Title>{compra.Produto}</Card.Title>
                    <Card.Text>Marca: {compra.Categoria}</Card.Text>
                    <Card.Text>Quantidade: {compra.Qtd}</Card.Text>
                    <Card.Text>
                      <strong>
                        {compra?.Preco.toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          currency: "BRL",
                          style: "currency",
                        })}
                      </strong>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>Nenhuma compra encontrada.</p>
        )}
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { chargeid } = context.params as { chargeid: string };

  let CompraEspecifica = await db("requisi1")
    .select("requisi1.Lanc", "requisi1.Pedido", "requisi1.Qtd", "requisi1.CodPro", "requisi1.Preco", "requisi1.Situacao", "Produto.Produto", "Produto.Categoria")
    .join("Produto", "requisi1.CodPro", "Produto.CodPro")
    .where("requisi1.Pedido", chargeid);

  return {
    props: {
      CompraEspecifica: CompraEspecifica || null,
    },
  };
};

export default CompraEspecifica;

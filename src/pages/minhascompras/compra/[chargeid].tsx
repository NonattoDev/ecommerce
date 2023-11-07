import Loading from "@/components/Loading/Loading";
import db from "@/db/db";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { Container } from "react-bootstrap";

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
    <Container>
      <h1>Compra #{chargeid}</h1>
      {CompraEspecifica ? (
        <ul>
          {CompraEspecifica.map((compra: any) => (
            <li key={compra.Pedido}>
              <p>Nome: {compra.Produto}</p>
              <p>Lanc: {compra.Lanc}</p>
              <p>Pedido: {compra.Pedido}</p>
              <p>Marca: {compra.Marca}</p>
              <p>Qtd: {compra.Qtd}</p>
              <p>Codpro: {compra.Codpro}</p>
              <p>Preco: {compra.Preco}</p>
              <p>Situacao: {compra.Situacao}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma compra encontrada.</p>
      )}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { chargeid } = context.params as { chargeid: string };

  let CompraEspecifica = await db("requisi1")
    .select("requisi1.Lanc", "requisi1.Pedido", "requisi1.Marca", "requisi1.Qtd", "requisi1.CodPro", "requisi1.Preco", "requisi1.Situacao", "Produto.Produto")
    .join("Produto", "requisi1.CodPro", "Produto.CodPro")
    .where("requisi1.Pedido", chargeid);

  console.log(CompraEspecifica);

  return {
    props: {
      CompraEspecifica: CompraEspecifica || null,
    },
  };
};

export default CompraEspecifica;

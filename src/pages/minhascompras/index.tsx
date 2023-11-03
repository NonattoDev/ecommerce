import Loading from "@/components/Loading/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";

const MinhasCompras = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated") {
    toast.warn("Você não está autenticado");
    useRouter().push("/");
  }

  return (
    <Container>
      <h1>Página de Compras do usuario</h1>
      <h2>Aqui terao em cards, todas as compras do usuario, clicando ele irá para a página especifica desse produto</h2>
      <Button onClick={() => router.push(`/minhascompras/compra/Pagina_De_Demonstracao`)}>clique aqui para ter uma demonstracao </Button>
    </Container>
  );
};

export default MinhasCompras;

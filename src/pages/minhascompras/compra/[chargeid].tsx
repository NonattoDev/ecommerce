import Loading from "@/components/Loading/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const CompraEspecifica = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated") {
    toast.warn("Você não está autenticado");
    useRouter().push("/");
  }

  const { chargeid } = useRouter().query;

  return <div>Página da compra em especifico {chargeid}</div>;
};

export default CompraEspecifica;

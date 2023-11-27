import Loading from "@/components/Loading/Loading";
import axios from "axios";
import React from "react";
import { Button, Container, Toast } from "react-bootstrap";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Image from "next/image";

const listBanners = async () => {
  const { data } = await axios.get("/api/admin/configuracoes/banners/banners");

  if (!data) {
    return toast.warn("Nenhum banner encontrado!");
  }

  return data;
};

const Configuracoes: React.FC = () => {
  const { data: images, isLoading, error } = useQuery("banners", listBanners);

  // Renderize de acordo com o estado de carregamento, erro e dados
  if (isLoading) return <Loading />;
  if (error) return <>Erro ao carregar as informações!</>;

  return (
    <Container>
      <h2>Configurações do portal</h2>
      {images.map((image: string) => (
        <div>
          <Image src={`${process.env.NEXT_PUBLIC_BANNERSIMAGEMURL}/${image}`} alt={image} width={1000} height={300} />
          <Button
            variant="danger"
            onClick={() => {
              toast.warn("Excluindo banner...");
            }}
          >
            Excluir
          </Button>
        </div>
      ))}
    </Container>
  );
};

export default Configuracoes;

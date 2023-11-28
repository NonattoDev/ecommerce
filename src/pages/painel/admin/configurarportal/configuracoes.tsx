import React, { useRef } from "react";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import Image from "next/image";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import Loading from "@/components/Loading/Loading";

const listBanners = async () => {
  const { data } = await axios.get("/api/admin/configuracoes/banners/banners");
  if (!data) {
    toast.warn("Nenhum banner encontrado!");
  }
  return data;
};

const handleDelete = async (imagem: string) => {
  // só pega o que tiver da / para direita
  const imagemFormatada = imagem.split("/")[1];
  try {
    const response = await axios.delete(`/api/admin/configuracoes/banners/${imagemFormatada}`);
    if (response.status === 200) {
      toast.success("Banner excluído com sucesso!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Erro ao excluir o banner.");
  }
};

const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    // Aqui você pode implementar o upload do arquivo
    // Por exemplo, enviar para um endpoint da sua API que lida com uploads
    try {
      const formData = new FormData();
      formData.append("banner", file);

      const response = await axios.post("/api/admin/configuracoes/banners/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Lide com a resposta do servidor aqui
      if (response.status === 200) {
        toast.success("Banner adicionado com sucesso!");
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const Configuracoes: React.FC = () => {
  const { data: images, isLoading, error } = useQuery("banners", listBanners);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  if (isLoading) return <Loading />;
  if (error) return <>Erro ao carregar as informações!</>;

  return (
    <Container>
      <h2>Configurações do portal</h2>
      <Button onClick={triggerFileInput}>Adicionar um novo banner</Button>
      <input type="file" ref={fileInputRef} onChange={handleUpload} style={{ display: "none" }} accept="image/*" />
      {images.map((image: string) => (
        <div key={image} style={{ margin: "10px auto" }}>
          <Image src={`${process.env.NEXT_PUBLIC_BANNERSIMAGEMURL}/${image}`} alt={image} width={1000} height={300} />
          <Button variant="danger" onClick={() => handleDelete(image)}>
            Excluir
          </Button>
        </div>
      ))}
    </Container>
  );
};

export default Configuracoes;

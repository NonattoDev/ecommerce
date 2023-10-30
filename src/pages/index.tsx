import NavbarSite from "@/components/Navbar/Navbar";
import MostrarTodosOsProdutos from "@/components/ProdutosPaginacao/TodosProdutos";
import Carrossel from "@/components/Carrossel/carrossel";
import { Button } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <Carrossel />
      <NavbarSite />
      <MostrarTodosOsProdutos />
    </>
  );
}

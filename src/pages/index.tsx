import { CarrinhoProvider } from "../context/CarrinhoContext";
import NavbarSite from "@/components/Navbar/Navbar";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import MostrarTodosOsProdutos from "@/components/ProdutosPaginacao/TodosProdutos";
import Carrossel from "@/components/Carrossel/carrossel";

export default function Home() {
  return (
    <>
      <Carrossel />
      <NavbarSite />
      <MostrarTodosOsProdutos />
    </>
  );
}

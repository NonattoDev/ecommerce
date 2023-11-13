import NavbarSite from "@/components/Navbar/Navbar";
import MostrarTodosOsProdutos from "@/components/ProdutosPaginacao/TodosProdutos";
import Carrossel from "@/components/Carrossel/carrossel";
import CookieConsent from "@/components/CookieConsent/CookieConsent";

export default function Home() {
  return (
    <>
      <Carrossel />
      <NavbarSite />
      <MostrarTodosOsProdutos />
      <CookieConsent />
    </>
  );
}

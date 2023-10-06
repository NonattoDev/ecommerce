import Pagination from "react-bootstrap/Pagination";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onPageChange: (pagina: number) => void;
}

function Paginacao({ paginaAtual, totalPaginas, onPageChange }: PaginacaoProps) {
  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) {
      onPageChange(paginaAtual - 1);
    }
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      onPageChange(paginaAtual + 1);
    }
  };

  const handlePaginaSelecionada = (pagina: number) => {
    onPageChange(pagina);
  };

  const renderPaginas = () => {
    const paginas = [];

    // Página anterior
    paginas.push(<Pagination.Prev key="pagina-anterior" disabled={paginaAtual === 1} onClick={handlePaginaAnterior} />);

    // Página atual e páginas próximas
    for (let pagina = Math.max(1, paginaAtual - 2); pagina <= Math.min(totalPaginas, paginaAtual + 2); pagina++) {
      paginas.push(
        <Pagination.Item key={pagina} active={pagina === paginaAtual} onClick={() => handlePaginaSelecionada(pagina)}>
          {pagina}
        </Pagination.Item>
      );
    }

    // Página próxima
    paginas.push(<Pagination.Next key="proxima-pagina" disabled={paginaAtual === totalPaginas} onClick={handleProximaPagina} />);

    return paginas;
  };

  return <Pagination>{renderPaginas()}</Pagination>;
}

export default Paginacao;

import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "react-query";
import axios from "axios";
import styles from "./TabelaDeVendasRT.module.css";

interface Produto {
  COdPro: number;
  QTD: number;
  Preco: number;
  Produto: string;
}

interface Cliente {
  Cliente: string;
  CGC: string;
}

interface Venda {
  Pedido: number;
  Data: string;
  CodCli: number;
  CodInd: number;
  Ecommerce: string;
  statusPagamento: string;
  Cliente: Cliente;
  Produtos: Produto[];
}

// Hook para buscar vendas com tipagem adequada
const useFetchVendas = () => {
  return useQuery<Venda[], Error>("vendas", async () => {
    const { data } = await axios.get<Venda[]>("/api/admin/dashboard/vendas");

    return data;
  });
};

const TabelaDeVendasRT = () => {
  const { data: vendas, isLoading, error } = useFetchVendas();
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao buscar dados</div>;

  const toggleRow = (pedido: number) => {
    setExpandedRows({
      ...expandedRows,
      [pedido]: !expandedRows[pedido],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "waiting":
      case "aguardando":
        return "yellow";
      case "paga":
      case "aprovado":
      case "paid":
        return "green";
      case "cancelada":
      case "cancelado":
        return "red";
      default:
        return "gray";
    }
  };

  // Função para calcular o valor total da venda
  const calcularValorTotal = (produtos: Produto[]) => {
    return produtos.reduce((total, produto) => total + produto.Preco * produto.QTD, 0).toLocaleString("pt-br");
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Pedido</th>
          <th>Status</th>
          <th>Cliente</th>
          <th>CGC</th>
          <th>Data</th>
          <th>Valor Total</th>
          <th>Detalhes</th>
        </tr>
      </thead>
      <tbody>
        {vendas &&
          vendas.map((venda) => (
            <React.Fragment key={venda.Pedido}>
              <tr key={venda.Pedido}>
                <td>{venda.Pedido}</td>
                <td style={{ backgroundColor: getStatusColor(venda.statusPagamento ?? "") }}>{venda.statusPagamento}</td>
                <td>{venda.Cliente.Cliente}</td>
                <td>{venda.Cliente.CGC}</td>
                <td>{venda.Data}</td>
                <td>{calcularValorTotal(venda.Produtos)}</td>
                <td>
                  <Button variant="light" onClick={() => toggleRow(venda.Pedido)}>
                    <FontAwesomeIcon icon={faSearch} width={20} />
                  </Button>
                </td>
              </tr>
              {expandedRows[venda.Pedido] && (
                <tr>
                  <td colSpan={6}>
                    <strong>Produtos Comprados:</strong>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Código do Produto</th>
                          <th>Produto</th>
                          <th>Quantidade</th>
                          <th>Preço</th>
                        </tr>
                      </thead>
                      <tbody>
                        {venda.Produtos.map((produto) => (
                          <tr key={produto.COdPro}>
                            <td>{produto.COdPro}</td>
                            <td>{produto.Produto}</td>
                            <td>{produto.QTD}</td>
                            <td>{produto.Preco}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
      </tbody>
    </Table>
  );
};

export default TabelaDeVendasRT;

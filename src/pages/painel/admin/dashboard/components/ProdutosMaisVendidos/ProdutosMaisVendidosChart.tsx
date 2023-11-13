// ProdutosMaisVendidosChart.js ou ProdutosMaisVendidosChart.jsx
import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import axios from "axios";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
import moment from "moment";
import styles from "../../dashboard.module.css";

interface ProdutoVendido {
  codpro: number;
  produto: string;
  contadorQtd: number;
}

const fetchProdutosMaisVendidos = async (startDate: string, endDate: string) => {
  // Verificar se as datas são válidas
  if (!moment(startDate, "YYYY-MM-DD", true).isValid() || !moment(endDate, "YYYY-MM-DD", true).isValid()) {
    // toast.error("Formato de data inválido. Use 'YYYY-MM-DD'.");
    return;
  }

  // Verificar se a data de início é anterior à data de término
  if (moment(startDate).isAfter(moment(endDate))) {
    // toast.error("A data de início deve ser anterior à data de término.");
    return;
  }
  try {
    const { data } = await axios.get(`/api/admin/dashboard/produtosvendidos/?start=${startDate}&end=${endDate}`);
    return data;
  } catch (error: any) {
    // toast.error(`Erro ao buscar os dados: ${error.response?.data?.error || error.message}`);
    return;
  }
};

const ProdutosMaisVendidosChart = () => {
  const [startDate, setStartDate] = useState(moment().subtract(1, "months").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const { data: produtosVendidos, isLoading, error, refetch } = useQuery(["produtosVendidos", startDate, endDate], () => fetchProdutosMaisVendidos(startDate, endDate), { enabled: true });

  const handleSearch = () => {
    refetch();
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    legend: {
      labels: {
        fontSize: 26,
      },
    },
  };

  return (
    <Card className={styles.CardAnalytics}>
      <Card.Body>
        <Card.Title>Produtos Mais Vendidos</Card.Title>
        <div className={styles.DatePicker}>
          <Form.Control type="date" size="sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Form.Control type="date" size="sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <Button onClick={handleSearch}>Filtrar</Button>
        </div>
        {isLoading && <Loading />}
        {error && <p>Erro ao carregar...</p>}
        {!isLoading && !error && produtosVendidos && (
          <Bar
            data={{
              labels: produtosVendidos.map((produto: ProdutoVendido) => produto.produto),
              datasets: [
                {
                  label: "Quantidade Vendida",
                  data: produtosVendidos.map((produto: ProdutoVendido) => produto.contadorQtd),
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)", // vermelho
                    "rgba(54, 162, 235, 0.2)", // azul
                    "rgba(255, 206, 86, 0.2)", // amarelo
                    "rgba(75, 192, 192, 0.2)", // verde-água
                    "rgba(153, 102, 255, 0.2)", // roxo
                    "rgba(255, 159, 64, 0.2)", // laranja
                    "rgba(199, 199, 199, 0.2)", // cinza
                    "rgba(83, 102, 255, 0.2)", // azul claro
                    "rgba(255, 99, 255, 0.2)", // magenta
                    "rgba(255, 159, 132, 0.2)", // salmão
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(159, 159, 159, 1)",
                    "rgba(83, 102, 255, 1)",
                    "rgba(255, 99, 255, 1)",
                    "rgba(255, 159, 132, 1)",
                  ],

                  borderWidth: 1,
                },
              ],
            }}
            options={options}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default ProdutosMaisVendidosChart;

// SalesChart.js ou SalesChart.jsx
import React, { useState, useCallback, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import axios from "axios";
import Loading from "@/components/Loading/Loading";
import moment from "moment";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import styles from "../../dashboard.module.css";
import { debounce } from "lodash";

interface Vendedor {
  "Código do Vendedor": number;
  Vendedor: string;
  contador: number;
}

const fetchVendedorDados = async (startDate: string, endDate: string) => {
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
    const { data } = await axios.get(`/api/admin/dashboard/vendedor/?start=${startDate}&end=${endDate}`);
    return data;
  } catch (error: any) {
    // Assumindo que você tem um bom tratamento de erros no lado do servidor e retorna uma mensagem de erro adequada
    // toast.error(`Erro ao buscar os dados: ${error.response?.data?.error || error.message}`);
    return;
  }
};

const GraficoVendedor = () => {
  const [startDate, setStartDate] = useState(moment().subtract(1, "months").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  // Desative a execução automática da query ao alterar as datas
  const { data: vendedorDados, isLoading, error, refetch } = useQuery(["vendedorDados", startDate, endDate], () => fetchVendedorDados(startDate, endDate), { enabled: false });
  // Função debounced para refetch
  const debouncedRefetch = useCallback(
    debounce(() => {
      refetch();
    }, 1500),
    [] // Este array vazio significa que o debouncedRefetch nunca vai mudar entre as renderizações
  );

  // Executar refetch na montagem do componente para carregar os dados iniciais
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Atualize o estado e execute a busca debounced
  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    debouncedRefetch();
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
        <Card.Title>Maior número de vendas</Card.Title>
        <div className={styles.DatePicker}>
          <Form.Control type="date" size="sm" value={startDate} onChange={(e) => handleDateChange(e.target.value, endDate)} />
          <Form.Control type="date" size="sm" value={endDate} onChange={(e) => handleDateChange(startDate, e.target.value)} />
          <Button onClick={debouncedRefetch}>Filtrar</Button>
        </div>
        {isLoading && <Loading />}
        {error && <p>Erro ao carregar...</p>}
        {!isLoading && !error && vendedorDados && (
          <Bar
            data={{
              labels: vendedorDados.map((vendedor: Vendedor) => vendedor.Vendedor),
              datasets: [
                {
                  label: "Vendas",
                  data: vendedorDados.map((vendedor: Vendedor) => vendedor.contador),
                  backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
                  borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
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

export default GraficoVendedor;

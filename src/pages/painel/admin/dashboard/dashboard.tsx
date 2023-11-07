// Dashboard.tsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Visitors",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
      borderWidth: 1,
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  legend: {
    labels: {
      fontSize: 26,
    },
  },
};

const Dashboard = () => {
  return (
    <Container fluid>
      <Row className="my-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Visitors</Card.Title>
              <Bar data={data} options={options} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* You can add more rows and charts following the pattern above */}
    </Container>
  );
};

export default Dashboard;

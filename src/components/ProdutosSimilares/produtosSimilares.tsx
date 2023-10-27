import Link from "next/link";
import { Card } from "react-bootstrap";

interface ProdutoSimilar {
  CodPro: number;
  Produto: string;
  Preco1: number;
  Caminho: string;
}

interface ProdutosSimilaresProps {
  produtos: ProdutoSimilar[];
}

const ProdutosSimilares: React.FC<ProdutosSimilaresProps> = ({ produtos }) => {
  return (
    <Card style={{ width: "100%", padding: "15px" }}>
      <h3 style={{ textAlign: "center", color: "#00A9FF", marginBottom: "10px" }}>Quem comprou isso, também se interessou por esses itens</h3>
      <div style={{ display: "flex", overflowX: "auto", maxWidth: "100%" }}>
        {produtos.map((produto) => (
          <Link key={produto.CodPro} href={`/produto/${produto.CodPro}`} style={{ textDecoration: "none" }}>
            <Card style={{ width: "200px", margin: "10px" }}>
              <Card.Img variant="top" src={`/fotosProdutos/${produto.Caminho}`} style={{ objectFit: "cover", height: "200px" }} />
              <Card.Body>
                <Card.Title>{produto.Produto}</Card.Title>
                <Card.Text>R$ {produto.Preco1.toLocaleString("pt-BR", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default ProdutosSimilares;

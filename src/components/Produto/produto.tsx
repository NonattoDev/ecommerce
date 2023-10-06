import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import styles from "./produto.module.css";

export type ProdutoComponenteProps = {
  CodPro: number;
  Produto: string;
  Referencia: string;
  Preco1: number;
  PrecoPromocao: number | null;
  PromocaoData: string | null;
  Caminho: string;
  Categoria: string;
  Estoque: number;
};

function ProdutoCard({ CodPro, Produto, Referencia, Preco1, PrecoPromocao, PromocaoData, Caminho, Categoria, Estoque }: ProdutoComponenteProps) {
  return (
    <Card className={styles["produto-card"]}>
      <div style={{ position: "relative" }}>
        <Card.Img
          src={`/fotosProdutos/${Caminho}`}
          alt={Produto}
          style={{ maxWidth: "100%", maxHeight: "310px", width: "100%", height: "310px" }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "fotosProdutos/erro/semProduto.png";
          }}
        />
        {Estoque <= 0 && (
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#c1121f",
              padding: "10px",
              borderRadius: "5px",
              fontWeight: "bold",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            Produto indisponível
          </p>
        )}
      </div>
      <Card.Body>
        <Card.Title style={{ fontSize: "15px" }}>
          <strong>{Produto}</strong>
        </Card.Title>
        <Card.Text>R$ {Preco1}</Card.Text>

        <Button variant="" size="sm" className="d-flex align-items-center">
          <svg style={{ width: "30px", height: "30px", color: "blue" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProdutoCard;

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import styles from "./produto.module.css";
import Loading from "../Loading/Loading";
import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { Produto } from "@/Types/Produto";

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
  const [isLoading, setIsLoading] = useState(true);
  const { handleAdicionarProdutosAoCarrinho } = useCarrinhoContext();
  const preco = Preco1.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    const image = new Image();
    image.src = `/fotosProdutos/${Caminho}`;
    image.onload = () => {
      setIsLoading(false);
    };
    image.onerror = () => {
      setIsLoading(false);
    };
  }, [Caminho]);

  return (
    <Card className={`${styles["produto-card"]} ${Estoque <= 0 ? styles.unavailable : ""}`}>
      {isLoading && <Loading />}
      <Link href={`/produto/${CodPro}`} style={{ textDecoration: "none" }} passHref>
        <div className={styles["produto-card-img-container"]}>
          {Estoque <= 0 && (
            <div className={styles["produto-card-unavailable"]}>
              <span>Produto indisponível</span>
            </div>
          )}

          <Card.Img
            src={`/fotosProdutos/${Caminho}`}
            alt={Produto}
            className={styles["produto-card-img"]}
            style={{ display: isLoading ? "none" : "block" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "../fotosProdutos/erro/semProduto.png";
            }}
            onLoad={() => {
              setIsLoading(false);
            }}
          />
        </div>
      </Link>
      <div className={styles["produto-card-content"]}>
        <Card.Body>
          <Card.Title className={styles["produto-card-title"]}>
            <strong>{Produto}</strong>
          </Card.Title>
          <div className={styles["produto-card-price"]}>{preco}</div>
          <div className={styles["produto-card-action"]}>
            {Estoque > 0 && (
              <Button
                variant=""
                size="sm"
                onClick={() => {
                  handleAdicionarProdutosAoCarrinho({ CodPro, Produto, Referencia, Preco1, PrecoPromocao, PromocaoData, Caminho, Categoria, Estoque, Quantidade: 1 } as Produto);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </Button>
            )}
          </div>
        </Card.Body>
      </div>
    </Card>
  );
}

export default ProdutoCard;

import Camisa from "../../../public/asdasd.png";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import styles from "./produto.module.css";

type ProdutoComponenteProps = {
  nome: string;
  descricao: string;
  preco: number;
};

function ProdutoCard({ nome, descricao, preco }: ProdutoComponenteProps) {
  return (
    <Card style={{ width: 305, height: 450, margin: 20 }}>
      <Image src={Camisa} alt="Camisa" width={300} />
      <Card.Body>
        <Card.Title>
          <strong>
            {nome} - R$ {preco}
          </strong>
        </Card.Title>
        <Card.Text>{descricao}</Card.Text>
        <div className="carrinhoProduto">
          <Button variant="primary" size="sm" className="d-flex align-items-center">
            <div className={styles.adicionarAoCarrinho}>
              <PlusCircleIcon style={{ width: 20, height: 20 }} />
              <p className="m-0">Adicionar ao carrinho</p>
            </div>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProdutoCard;

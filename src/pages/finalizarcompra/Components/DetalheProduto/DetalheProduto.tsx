import { Produto } from "@/Types/Produto";
import { Card, Form } from "react-bootstrap";
import Image from "next/image";
import styles from "./DetalheProduto.module.css";
import { useCarrinhoContext } from "@/context/CarrinhoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const DetalheProduto: React.FC<{ produto: Produto }> = ({ produto }) => {
  if (!produto) {
    // Se o produto não estiver disponível, retorne um placeholder ou null
    return <div>Produto não encontrado</div>;
  }

  const { handleRemoverProduto, handleAtualizarQuantidadeProduto } = useCarrinhoContext();

  // Adicione uma verificação para garantir que o produto e a propriedade Caminho existam
  const imagePath = produto?.Caminho ? `${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${produto.Caminho}` : `${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/erro/semProduto.png`;

  return (
    <Card key={produto?.CodPro} className={styles.cardContainer}>
      <Card.Body>
        <div className={styles.cardProdutoDetalheContainer}>
          <div className={styles.produtoInfo}>
            <div>
              <Image src={imagePath} alt={produto?.Produto} width={100} height={100} />
            </div>
            <div>
              <h5>{produto?.Produto}</h5>
              <FontAwesomeIcon icon={faTrash} onClick={() => handleRemoverProduto(produto?.CodPro)} className={styles.botaoExcluirItem} />
            </div>
          </div>
          <div className={styles.produtoSelect}>
            <Form>
              <Form.Control
                name="quantidadeProduto"
                type="number"
                value={produto?.Quantidade > produto?.Estoque ? produto?.Estoque : produto?.Quantidade || 0}
                onChange={(e) => {
                  const quantidade = e.target.value === "" ? 1 : parseInt(e.target.value);
                  const valorMaximo = produto?.Estoque;
                  const novaQuantidade = quantidade > valorMaximo ? valorMaximo : quantidade;
                  handleAtualizarQuantidadeProduto(produto?.CodPro, novaQuantidade);
                }}
                className={styles.inputQuantidade}
                min={1}
                max={produto?.Estoque}
              />
            </Form>
          </div>
          <div className={styles.produtoPreco}>
            <p>R$: {produto?.Preco1.toLocaleString("pt-br")}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DetalheProduto;

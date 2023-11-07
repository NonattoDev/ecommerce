import { Produto } from "@/Types/Produto";
import { Card, Form } from "react-bootstrap";
import Image from "next/image";
import styles from "./DetalheProduto.module.css";
import { useCarrinhoContext } from "@/context/CarrinhoContext";

const DetalheProduto: React.FC<{ produto: Produto }> = ({ produto }) => {
  const { handleRemoverProduto, handleAtualizarQuantidadeProduto } = useCarrinhoContext();

  // Adicione uma verificação para garantir que o produto e a propriedade Caminho existam
  const imagePath = produto?.Caminho ? `/fotosProdutos/${produto.Caminho}` : '/fotosProdutos/erro/semProduto.png'; // Caminho padrão ou imagem padrão

  return (
    <Card key={produto.CodPro} className={styles.cardContainer}>
      <Card.Body>
        <div className={styles.cardProdutoDetalheContainer}>
          <div className={styles.produtoInfo}>
            <div>
              {/* Use a variável imagePath para o atributo src da imagem */}
              <Image src={imagePath} alt={produto.Produto} width={100} height={100} />
            </div>
            <div>
              <h5>{produto.Produto}</h5>
              <p className={styles.botaoExcluirItem} onClick={() => handleRemoverProduto(produto.CodPro)}>
                Excluir
              </p>
            </div>
          </div>
          <div className={styles.produtoSelect}>
            <Form>
              <Form.Control
                name="quantidadeProduto"
                type="number"
                value={produto.Quantidade > produto.Estoque ? produto.Estoque : produto.Quantidade || 0}
                onChange={(e) => {
                  const quantidade = e.target.value === "" ? 1 : parseInt(e.target.value);
                  const valorMaximo = produto.Estoque;
                  const novaQuantidade = quantidade > valorMaximo ? valorMaximo : quantidade;
                  handleAtualizarQuantidadeProduto(produto.CodPro, novaQuantidade);
                }}
                className={styles.inputQuantidade}
                min={1}
                max={produto.Estoque}
              />
            </Form>
          </div>
          <div className={styles.produtoPreco}>
            <p>R$: {produto.Preco1.toLocaleString("pt-br")}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DetalheProduto;

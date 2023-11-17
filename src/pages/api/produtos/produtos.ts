import db from "@/db/db"; // Ajuste o caminho conforme necessário
import type { NextApiRequest, NextApiResponse } from "next";

// Definindo as interfaces para os tipos de dados retornados
interface Produto {
  CodPro: number;
  Produto: string;
  Referencia: string;
  Preco1: number;
  PrecoPromocao: number;
  PromocaoData: string; // Ajuste o tipo conforme o formato da sua data
  Caminho: string;
  Categoria: string;
  Estoque: number;
}

interface PaginacaoResponse {
  produtos: Produto[];
  qtdProdutos: number;
}

interface ErrorResponse {
  Mensagem: string;
}

export default async function listarTodosOsProdutosPorPaginacao(req: NextApiRequest, res: NextApiResponse<PaginacaoResponse | ErrorResponse>) {
  if (req.method == "GET") {
    try {
      const { pagina, itensPorPagina } = req.query;
      const paginaAtual = parseInt(pagina as string) || 1;
      const itensPorPaginaAtual = parseInt(itensPorPagina as string) || 10;

      const startIndex = (paginaAtual - 1) * itensPorPaginaAtual;
      const endIndex = startIndex + itensPorPaginaAtual;

      // Subquery para numerar os produtos
      const subquery = db("produto")
        .select(
          "CodPro",
          "Produto",
          "Referencia",
          "Preco1",
          "PrecoPromocao",
          "PromocaoData",
          "Caminho",
          "Categoria",
          "Estoque1",
          "EstoqueReservado1",
          db.raw("ROW_NUMBER() OVER (ORDER BY CASE WHEN ?? > ?? THEN 0 ELSE 1 END, ??) AS RowNum", ["Estoque1", "EstoqueReservado1", "CodPro"])
        )
        .where("ECommerce", "=", "X")
        .andWhere(function () {
          this.whereNull("Inativo").orWhere("Inativo", "!=", "X");
        })
        .as("produtosNumerados");

      // Consulta principal
      const produtos = await db
        .select("CodPro", "Produto", "Referencia", "Preco1", "PrecoPromocao", "PromocaoData", "Caminho", "Categoria", db.raw("?? - ?? AS Estoque", ["Estoque1", "EstoqueReservado1"]))
        .from(subquery)
        .where("RowNum", ">", startIndex)
        .andWhere("RowNum", "<=", endIndex);

      // Consulta para contar o total de produtos
      const queryProdutos = await db.raw(`
              SELECT COUNT(*) AS totalProdutos
              FROM (
                SELECT CodPro, Produto, Referencia, Preco1, PrecoPromocao, PromocaoData, Caminho, Categoria, Estoque1 - EstoqueReservado1 AS Estoque
                FROM produto
                WHERE ECommerce = 'X' AND (Inativo IS NULL OR Inativo != 'X')
              ) AS produtosNumerados
            `);

      const qtdProdutos = parseInt(queryProdutos[0].totalProdutos);

      return res.json({ produtos, qtdProdutos });
    } catch (error) {
      return res.status(500).json({ Mensagem: "Erro interno de servidor" });
    }
  }
  return null;
}

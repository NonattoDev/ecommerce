import db from "@/db/db"; // Ajuste o caminho conforme necessário
import type { NextApiRequest, NextApiResponse } from "next";

// Definindo as interfaces para os tipos de dados retornados
interface Produto {
  CodPro: number;
  Produto: string;
  // Adicione os outros campos conforme necessário
}

interface ErrorResponse {
  Mensagem: string;
}

export default async function produtosPorGrupo(req: NextApiRequest, res: NextApiResponse<{ produtos: Produto[]; qtdProdutos: number } | ErrorResponse>) {
  if (req.method === "GET") {
    try {
      const { pagina, itensPorPagina, grupo } = req.query as {
        pagina: string;
        itensPorPagina: string;
        grupo: string;
      };

      const paginaAtual = parseInt(pagina);
      const itensPorPaginaAtual = parseInt(itensPorPagina);
      const startIndex = (paginaAtual - 1) * itensPorPaginaAtual;

      // Consulta para produtos
      const produtos = await db("produto")
        .select("CodPro", "Produto", "Referencia", "Preco1", "PrecoPromocao", "PromocaoData", "Caminho", "Categoria", db.raw("Estoque1 - EstoqueReservado1 AS Estoque"))
        .where("CodGrp", grupo)
        .where("Ecommerce", "X")
        .where(function () {
          this.whereNull("Inativo").orWhere("Inativo", "!=", "X");
        })
        .orderBy("CodPro")
        .offset(startIndex)
        .limit(itensPorPaginaAtual);

      // Consulta para quantidade total de produtos
      const queryProdutos = await db
        .select()
        .count("* as totalProdutos")
        .from("produto")
        .where("CodGrp", grupo)
        .where("Ecommerce", "X")
        .where(function () {
          this.whereNull("Inativo").orWhere("Inativo", "!=", "X");
        });

      const qtdProdutos = typeof queryProdutos[0].totalProdutos === "string" ? parseInt(queryProdutos[0].totalProdutos) : queryProdutos[0].totalProdutos;

      return res.json({ produtos, qtdProdutos });
    } catch (error) {
      return res.status(500).json({ Mensagem: "Erro interno de servidor" });
    }
  } else {
    return res.status(405).json({ Mensagem: "Método não permitido" });
  }
}

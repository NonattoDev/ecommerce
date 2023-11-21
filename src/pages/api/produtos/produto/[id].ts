import db from "@/db/db"; // Ajuste o caminho conforme necessário
import { log } from "console";
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

export default async function produtoPorID(req: NextApiRequest, res: NextApiResponse<{ produto: Produto; produtosSimilares: Produto[] } | ErrorResponse>) {
  if (req.method === "GET") {
    try {
      const { id } = req.query as { id: string }; // Ajuste conforme o tipo real do ID

      // Consulta para o produto
      const produtos = await db("produto")
        // Lista de campos
        .where("CodPro", id)
        .where("Ecommerce", "X");

      // Consulta para produtos similares
      const produtosSimilares = await db("Produto_Similar as A")
        .join("Produto as B", "A.CodPro1", "B.CodPro")
        .where("A.CodPro", id) // Substitua id pelo valor desejado
        .where("B.ECommerce", "X")
        .andWhere(function () {
          this.whereNull("B.Inativo").orWhereNot("B.Inativo", "X");
        })
        .select("B.CodPro", "B.Produto", "B.Preco1", "B.Caminho") // Adicionando Preco1 à seleção
        .orderBy("B.Produto");

      return res.json({ produto: produtos[0], produtosSimilares });
    } catch (error) {
      return res.status(500).json({ Mensagem: "Erro interno de servidor" });
    }
  } else {
    return res.status(405).json({ Mensagem: "Método não permitido" });
  }
}

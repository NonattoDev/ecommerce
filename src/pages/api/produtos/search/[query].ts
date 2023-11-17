import db from "@/db/db"; // Ajuste o caminho conforme necessário
import type { NextApiRequest, NextApiResponse } from "next";

// Definindo as interfaces para os tipos de dados retornados
interface Produto {
  CodPro: number;
  Produto: string;
  Categoria: string;
  // Adicione os outros campos conforme necessário
}

interface ErrorResponse {
  Mensagem: string;
}

export default async function listarProdutosViaPesquisa(req: NextApiRequest, res: NextApiResponse<Produto[] | ErrorResponse>) {
  if (req.method === "GET") {
    try {
      let { query } = req.query as { query: string };
      query = query.replace(/[^\w\s]/gi, ""); // Remove caracteres especiais

      const result = await db("Produto")
        .select("CodPro", "Produto", "Categoria")
        .where(function () {
          this.where("Produto", "like", `%${query}%`)
            .orWhere("Complemento", "like", `%${query}%`)
            .orWhere("CodPro", "like", `%${query}%`)
            .orWhere("Referencia", "like", `%${query}%`)
            .orWhere("PAFProduto", "like", `%${query}%`);
        })
        .whereNotNull("Inativo")
        .whereNot("Inativo", "X")
        .where("Ecommerce", "X");

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ Mensagem: "Erro interno de servidor" });
    }
  } else {
    return res.status(405).json({ Mensagem: "Método não permitido" });
  }
}

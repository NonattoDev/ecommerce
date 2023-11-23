import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    let { start, end } = req.query;

    try {
      const produtosMaisVendidos = await db("venda1")
        .select("venda1.codpro", "produto.produto")
        .sum("venda1.qtd as contadorQtd")
        .join("venda", "venda1.numero", "=", "venda.numero")
        .join("produto", "venda1.codpro", "=", "produto.codpro")
        .where("venda.status", "VENDA")
        .whereBetween("venda.data", [start as string, end as string]) // Formato 'AAAA-MM-DD' para compatibilidade SQL
        .groupBy("venda1.codpro", "produto.produto")
        .orderBy("contadorQtd", "desc")
        .limit(10);

      res.status(200).json(produtosMaisVendidos);
    } catch (error: any) {
      console.log(error.message);

      return res.status(500).json({ error: error.message });
    }
  }
  res.status(405).json({ message: "Method not allowed" });
}

import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const grupos = await db("grupo").whereNotNull("grupo").andWhereRaw("LEN(grupo) > 3");

      const subgrupos = await db("subgrupo").whereNotNull("subgrupo").andWhereRaw("LEN(subgrupo) > 3");

      return res.status(200).json({ grupos, subgrupos });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Erro ao buscar a contagem de produtos", error });
    }
  } else {
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}

// pages/api/path-to-your-endpoint.js
import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { count } = (await db("Produto").count("* as count").first()) as { count: number };

      console.log(count);

      res.status(200).json(count);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar a contagem de produtos", error });
    }
  } else {
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}

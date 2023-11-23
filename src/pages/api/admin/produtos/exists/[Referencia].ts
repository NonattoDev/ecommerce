import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(400).json({ error: "Método não permitido" });
  }

  const { Referencia } = req.query;

  //Verificar se existe algum produto com a mesma referencia
  const refencia = await db("Produto").where("Referencia", Referencia).first();
  if (refencia) {
    return res.json({ exists: "Já existe um produto com essa referência" });
  }
  res.status(200).json({ message: "API funcionando corretamente" });
}

import db from "@/db/db";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const produto = req.body;

    try {
      const dataAtual = moment().format("YYYY-MM-DD");

      const result = await db("Produto").max("CodPro as maxCodPro").first();

      const nextCodPro = result?.maxCodPro + 1;

      const produtoInsert = await db("Produto").insert({ CodPro: nextCodPro, Ecommerce: "X", Inativo: "F", Data: dataAtual, ...produto });

      return res.json(nextCodPro);
    } catch (error) {
      console.log(error);

      return res.json({ error: "Ocorreu um erro ao adicionar o produto" });
    }
  }
}

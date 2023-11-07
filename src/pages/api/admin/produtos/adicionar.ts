import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { Produto, Referencia, CodigoBarras, Unidade, Preco1, Origem, CstCompra, Situacao, CSOSN, CodSub, CodGrp, Estoque1, EstoqueReservado1, Caminho } = req.body;
    //Verificar se existe algum produto com a mesma referencia
    const refencia = await db("Produto").where("Referencia", Referencia).first();

    if (refencia) {
      return res.json({ error: "Já existe um produto com essa referência" });
    }

    return res.json("Db ok");
  }
}

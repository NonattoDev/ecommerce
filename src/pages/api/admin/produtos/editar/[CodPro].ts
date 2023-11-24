import { log } from "console";
import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { CodPro } = req.query;

  if (CodPro === undefined) {
    return res.status(400).json({ message: "Código do produto não informado" });
  }

  if (req.method === "GET") {
    try {
      const produto = await db("produto").where({ CodPro }).first();
      if (!produto) {
        return res.status(404).json({ message: `Produto com código ${CodPro} não encontrado` });
      }
      return res.status(200).json(produto);
    } catch (error) {
      log(error);
      return res.status(400).json({ message: "Erro ao buscar produto" });
    }
  }

  if (req.method === "PUT") {
    try {
      const produto = await db("produto").where({ CodPro }).first();

      if (produto.Referencia !== req.body.Referencia) {
        const produtoReferencia = await db("produto").where({ Referencia: req.body.Referencia }).first();
        if (produtoReferencia) {
          return res.status(400).json({ message: `Referência ${req.body.Referencia} já cadastrada` });
        }
      }

      await db("produto").where({ CodPro }).update(req.body);
      return res.status(200).json({ message: "Produto atualizado com sucesso" });
    } catch (error) {
      log(error);
      return res.status(400).json({ message: "Erro ao atualizar produto" });
    }
  }
}

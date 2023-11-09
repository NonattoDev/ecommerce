import db from "@/db/db";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    let { start, end } = req.query;

    try {
      const dadosVendedor = await db
        .select("v.codind as Código do Vendedor", "i.indicador as Vendedor")
        .count("* as contador")
        .from("venda as v")
        .innerJoin("indicado as i", "i.codind", "v.codind")
        .whereBetween("v.Data", [start as string, end as string])
        .andWhere("status", "VENDA")
        .groupBy("v.codind", "i.indicador")
        .orderBy("contador", "desc")
        .limit(10);

      return res.status(200).json(dadosVendedor);
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ error: error });
    }
  }
};

export default handler;

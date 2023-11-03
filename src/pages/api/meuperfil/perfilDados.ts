import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id } = req.body;

    const dadosCliente = await db("clientes").select("*").where("CodCli", id);
  }
  return res.status(500).json("Não é possível");
}

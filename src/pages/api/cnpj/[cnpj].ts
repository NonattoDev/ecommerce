import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import db from "@/db/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { cnpj } = req.query;

    try {
      const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
      return res.status(200).json(response.data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      // Se não for uma instância de Error, trate como um erro genérico
      return res.status(500).json({ message: "Um erro desconhecido ocorreu." });
    }
  }

  return res.status(405).end(); // Método não permitido se não for GET
}

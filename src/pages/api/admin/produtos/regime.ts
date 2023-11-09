import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { CRT: regime } = await db("Empresa").first();

      // Separa o dígito do restante da string
      const regimeCode = regime.split(" - ")[0];

      let regimeNome;
      switch (regimeCode) {
        case "1":
          regimeNome = "Simples Nacional";
          break;
        case "2":
          regimeNome = "Simples Nacional excesso de sublimite de receita bruta";
          break;
        case "3":
          regimeNome = "Regime Normal";
          break;
        default:
          regimeNome = "Desconhecido"; // ou qualquer valor padrão que você queira usar
      }

      return res.status(200).json({ regimeNome });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar a contagem de produtos", error });
    }
  } else {
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}

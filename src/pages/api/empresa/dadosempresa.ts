import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

// Definindo a interface para os dados da empresa
interface Empresa {
  Empresa: string;
  Razao: string;
  Endereco: string;
  bairro: string;
  Cidade: string;
  Estado: string;
  Cep: string;
  Tel: string;
  tel2: string;
  Email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Empresa[] | { message: string }>) {
  if (req.method === "GET") {
    try {
      // Executa a consulta e espera o resultado
      const infoEmpresa: Empresa[] = await db.select("Empresa", "Razao", "Endereco", "bairro", "Cidade", "Estado", "Cep", "Tel", "tel2", "Email").from("Empresa").where("CodEmp", 1);
      return res.json(infoEmpresa);
    } catch (error: any) {
      // Melhorando a manipulação de erros
      return res.status(400).json({ message: error.message || "Unknown error" });
    }
  }
}

import db from "@/db/db"; // Ajuste o caminho conforme necessário
import type { NextApiRequest, NextApiResponse } from "next";

interface Endereco {
  Endereco: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
  CEP: string;
  Tel2: string;
  Tel: string;
  CampoLivre: string;
  ComplementoEndereco: string;
  Numero: number;
  CodMun: number;
}

interface EnderecoEntrega extends Endereco {
  // Campos adicionais para EnderecoEntrega, se houver
}

interface ErrorResponse {
  mensagem: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ enderecoPrincipal?: Endereco; enderecosEntrega?: EnderecoEntrega[] } | string | ErrorResponse>) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      console.log("GET");

      const enderecoPrincipal = await db("clientes")
        .where("CodCli", id)
        .select("Endereco", "Bairro", "Cidade", "Estado", "CEP", "TelEnt as Tel2", "TelEnt2 as Tel", "CampoLivre", "ComplementoEndereco", "Numero", "CodMun")
        .first();
      const enderecosEntrega = await db("Cliente_Entrega").where("CodCli", id).select("*");

      return res.json({ enderecoPrincipal, enderecosEntrega });
    } else if (req.method === "POST") {
      console.log("POST ");

      const endereco = req.body;
      const enderecoCompleto = {
        CodCli: parseInt(id as string),
        ...endereco,
        Numero: parseInt(endereco.Numero),
      };

      await db("Cliente_Entrega").insert(enderecoCompleto).returning("*");

      return res.json("Endereco inserido");
    } else {
      return res.status(405).json({ mensagem: "Método não permitido" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao processar a requisição" });
  }
}

import db from "@/db/db"; // Ajuste o caminho conforme necessário
import type { NextApiRequest, NextApiResponse } from "next";

// Definindo as interfaces para os tipos de dados retornados
interface GrupoProduto {
  CodGrp: number;
  Grupo: string;
  Qtd: number;
}

interface Grupos {
  CodGrp: number;
  Grupo: string;
}

// Nova interface para a resposta
interface ResponseData {
  gruposDeProdutos: GrupoProduto[];
  grupos: Grupos[];
}

interface ErrorResponse {
  Mensagem: string;
}

export default async function listarTopGrupos(req: NextApiRequest, res: NextApiResponse<ResponseData | ErrorResponse>) {
  if (req.method === "GET") {
    try {
      const gruposDeProdutos: GrupoProduto[] = await db.raw(`Select top 8 B.CodGrp, A.Grupo, 
      (Select Count(*) From Produto C Where C.CodGrp = B.CodGrp and C.ECommerce = 'X' and (C.Inativo is null or C.Inativo != 'X')) Qtd 
      From Grupo A, Produto B 
      Where B.ECommerce = 'X' and 
           (B.Inativo is null or B.Inativo != 'X') and 
            A.CodGrp = B.CodGrp 
      Group by B.CodGrp, A.Grupo 
      Order by A.Grupo`);

      const grupos: Grupos[] = await db.raw(`Select B.CodGrp, A.Grupo, 
      (Select Count(*) From Produto C Where C.CodGrp = B.CodGrp and C.ECommerce = 'X' and (C.Inativo is null or C.Inativo != 'X')) Qtd 
      From Grupo A, Produto B 
      Where B.ECommerce = 'X' and 
           (B.Inativo is null or B.Inativo != 'X') and 
            A.CodGrp = B.CodGrp 
      Group by B.CodGrp, A.Grupo 
      Order by A.Grupo`);

      const response: ResponseData = {
        gruposDeProdutos,
        grupos,
      };

      return res.json(response);
    } catch (error) {
      return res.status(500).json({ Mensagem: "Erro interno de servidor" });
    }
  } else {
    return res.status(405).json({ Mensagem: "Método não permitido" });
  }
}

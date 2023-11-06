import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { codcli } = req.query;
    try {
      const cliente = await db("Clientes")
        .select("CodCli", "Cliente", "Razao", "Complemento", "EMail", "CGC", "IE", "TelEnt", "DataCad", "Endereco", "Bairro", "Cidade", "Estado", "Cep")
        .where("CodCLi", codcli)
        .first();

      if (!cliente) {
        return res.status(404).json("Cliente não encontrado");
      }

      return res.json(cliente);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }

      // Se não for uma instância de Error, trate como um erro genérico
      return res.status(500).json({ message: "Um erro desconhecido ocorreu." });
    }
  }

  if (req.method === "PUT") {
    const { codcli } = req.query;
    const { Cliente, Razao, Complemento, EMail, CGC, IE, TelEnt, DataCad, Endereco, Bairro, Cidade, Estado, Cep } = req.body;

    try {
      const cliente = await db("Clientes")
        .select("CodCli", "Cliente", "Razao", "Complemento", "EMail", "CGC", "IE", "TelEnt", "DataCad", "Endereco", "Bairro", "Cidade", "Estado", "Cep")
        .where("CodCLi", codcli)
        .first();

      if (!cliente) {
        return res.status(404).json("Cliente não encontrado");
      }

      await db("Clientes").where("CodCli", codcli).update({
        Cliente,
        Razao,
        Complemento,
        EMail,
        CGC,
        IE,
        TelEnt,
        DataCad,
        Endereco,
        Bairro,
        Cidade,
        Estado,
        Cep,
      });

      return res.status(200).json("Cliente atualizado com sucesso");
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

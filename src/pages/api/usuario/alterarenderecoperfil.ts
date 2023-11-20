import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "PUT") {
    const atualizarEnderecoUsuario = await db("clientes").where("CodCli", req.body.CodCli).update(req.body);

    res.status(200).json({ message: "Endereço do perfil alterado com sucesso" });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}

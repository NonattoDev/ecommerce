import db from "@/db/db";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const { tokenData, senha } = req.body;

    if (!senha) return res.status(400).json({ message: "Digite uma senha válida!" });
    if (senha.length < 8) return res.status(400).json({ message: "A senha deve ter no mínimo 8 caracteres" });

    await db("Clientes").update({ Chave: senha }).where("CodCli", tokenData.CodCli);

    const credenciaisLogin = await db("Clientes").select("Email", "Chave").where("CodCli", tokenData.CodCli).first();

    await db("tokens_confirmacao").delete("*").where("CodCli", tokenData.CodCli);

    // Aqui você pode adicionar a lógica para criar a senha
    const response = {
      message: "Senha criada com sucesso!",
      email: credenciaisLogin.Email,
      chave: credenciaisLogin.Chave,
    };
    res.status(200).json(response);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Método ${req.method} não permitido` });
  }
}

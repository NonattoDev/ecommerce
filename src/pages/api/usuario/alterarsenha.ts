import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "@/db/db";
import transporter from "@/services/nodeMailer";

export default async function alterarSenha(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { password, token } = req.body as { password: string; token: string };

    const verifyToken = jwt.verify(token, "OdXFNuFU4BJOmfkYMYhy195IMcM");
    const decodedToken = jwt.decode(token) as { data: { CodCli: string; email: string; cliente: string } };

    const CodCli = decodedToken.data.CodCli;

    try {
      const updateSenha = await db("clientes").where("CodCli", CodCli).update({ chave: password });
      const mailOptions = {
        from: {
          name: "Soft Line Sistemas",
          address: "softlinedocs@gmail.com",
        },
        to: decodedToken.data.email,
        subject: "Alteração de senha",
        html: `<div style="font-family: Arial, sans-serif; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #27ae60;">🔓 Alteração de Senha Concluída!</h2>
        <p>Olá <strong>${decodedToken.data.cliente}</strong>,</p>
        <p>Sua senha foi redefinida com sucesso! 🎉</p>
        <hr style="border-top: 1px solid #dddddd; margin: 20px 0;">
        <p>Se você não solicitou essa alteração, por favor, entre em contato conosco imediatamente para garantir a segurança da sua conta. 🔐</p>
        <p>É importante manter sua conta segura e atualizada.</p>
        <hr style="border-top: 1px solid #dddddd; margin: 20px 0;">
        <p>Atenciosamente,</p>
        <p><strong>Equipe Soft Line Sistemas</strong></p>
      </div>
      `,
      };

      try {
        const enviarEmail = await transporter.sendMail(mailOptions);
        console.log("Email enviado: ", enviarEmail.response);
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json("Senha alterada com sucesso!");
    } catch (error: any) {
      // Tratamento de erros do JWT
      if (error.message === "jwt malformed") return res.status(401).json("Código inserido é invalido");
      if (error.message === "jwt expired") return res.status(401).json("Esse código de recuperação expirou, tente novamente");

      // Tratamento de erros do banco de dados knex mssql
      if (error.message.includes("Invalid column name")) return res.status(400).json("Coluna não encontrada");
      if (error.message.includes("A transaction must be rolled back")) return res.status(500).json("Erro ao alterar senha");
      if (error.message.includes("Cannot insert duplicate key row in object")) return res.status(400).json("Chave duplicada");

      //Erro padrão
      return res.status(500).json(error.message);
    }
  }

  // Método não permitido
  res.status(405).end();
}

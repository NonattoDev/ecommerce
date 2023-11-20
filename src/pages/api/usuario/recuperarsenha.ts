import db from "@/db/db";
import transporter from "@/services/nodeMailer";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function recuperarSenha(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const cliente = await db("clientes").select("email", "cliente", "CodCli").where("email", req.body.email).first();
      if (!cliente) return res.status(404).json({ message: "Ops, não encontramos esse email por aqui :(" });
      const token = jwt.sign({ data: cliente, exp: Math.floor(Date.now() / 1000) + 600 }, "OdXFNuFU4BJOmfkYMYhy195IMcM");
      const mailOptions = {
        from: {
          name: "Soft Line Sistemas",
          address: "softlinedocs@gmail.com",
        },
        to: cliente.email,
        subject: "Alteração de Senha",
        html: `
        <div style="font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h2>Recuperação de Senha</h2>
          <p>Olá ${cliente.cliente},</p>
          <p>Recebemos uma solicitação para alterar a senha da sua conta.</p>
          <p>Clique no botão abaixo para redefinir sua senha:</p>
          <a href="${process.env.URL}/usuario/recuperarsenha/${token}" style="background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; transition: background-color 0.3s;">
            Recuperar Senha
          </a>
          <p style="margin-top: 20px;">Se você não solicitou essa alteração, por favor ignore este e-mail ou entre em contato conosco.</p>
          <hr>
          <p>Atenciosamente,</p>
          <p><strong>Equipe Soft Line Sistemas</strong></p>
        </div>
        <style>
          a:hover {
            background-color: #2ecc71;
          }
        </style>
      `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          // Se ocorrer um erro ao enviar o e-mail, você pode lidar com ele aqui
        } else {
          console.log("E-mail enviado com sucesso:");
        }
      });

      return res.json("Email de recuperação de senha enviado com sucesso!");
    } catch (error) {
      return res.status(500).json({ message: "Ops, ocorreu um erro ao enviar o email de recuperação de senha :(" });
    }
  } else {
    res.status(405).end(); // Método não permitido
  }
}

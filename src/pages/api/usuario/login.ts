import db from "@/db/db"; // Ajuste o caminho conforme necessário
import transporter from "@/services/nodeMailer";
import axios from "axios";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";

interface Usuario {
  email: string;
  CodCli: number;
  Cliente: string;
  Razao: string;
  chave: string;
}

interface LoginResponse {
  usuario: Usuario;
  admin: boolean;
}

interface ErrorResponse {
  mensagem: string;
}

export default async function loginUsuario(req: NextApiRequest, res: NextApiResponse<LoginResponse | ErrorResponse>) {
  if (req.method !== "POST") return res.status(405).json({ mensagem: "Método não permitido" });

  const { email, password: chave, ip } = req.body;

  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);

    let usuario = await db("senha")
      .select("EMail as email", "CodUsu as CodCli", "Usuario as Cliente", "Usuario as Razao", "Senha as chave")
      .where(function () {
        this.where("Email", email).orWhere("Usuario", email);
      })
      .andWhere("Senha", chave)
      .first();

    if (usuario) {
      const mailOptions = {
        from: {
          name: "Soft Line Sistemas",
          address: "softlinedocs@gmail.com",
        },
        to: email,
        subject: "Login realizado com sucesso como ADMIN",
        html: `
              <div style="font-family: 'Arial', sans-serif; color: #333;">
                <h2>Olá Administrador 👋</h2>
                <p>Você realizou o login com sucesso no S-Commerce. 🎉</p>
                <p><strong>Detalhes do Acesso:</strong></p>
                <ul>
                  <li><strong>País:</strong> ${response.data.country} 🌍</li>
                  <li><strong>Estado:</strong> ${response.data.regionName} 📍</li>
                  <li><strong>Cidade:</strong> ${response.data.city} 🏙️</li>
                  <li><strong>Serviço de Provedor de Internet (ISP):</strong> ${response.data.isp} 🌐</li>
                  <li><strong>Organização:</strong> ${response.data.org} 🏢</li>
                  <li><strong>IP:</strong> ${response.data.query} 💻</li>
                </ul>
                <p>Se você não reconhece esse acesso, entre em contato conosco imediatamente. 🚨</p>
                <hr>
                <p>Atenciosamente,</p>
                <p><strong>Equipe S-Commerce</strong></p>
              </div>
            `,
      };

      try {
        const enviarEmail = await transporter.sendMail(mailOptions);
        console.log("Email enviado: ", enviarEmail.response);
      } catch (error) {
        console.log(error);
      }
      const hora = moment().format("HH:mm");

      const his = {
        Codcli: usuario.CodCli,
        Data: new Date(),
        Hora: hora,
        CodTrans: 1,
        CodUsu: 1,
        Historico: `Administrador realizou login no Ecommerce através do IP: ${ip}`,
      };

      await db("Cli_His").insert(his).where("CodCli", usuario.CodCli);

      return res.status(200).json({ usuario, admin: true });
    }

    if (!usuario) {
      usuario = await db("clientes").select("email", "CodCli", "Cliente", "Razao", "chave").where({ email, chave }).first();
    }

    if (!usuario) {
      return res.status(401).json({ mensagem: "Credenciais inválidas!" });
    }

    const mailOptions = {
      from: {
        name: "Soft Line Sistemas",
        address: "softlinedocs@gmail.com",
      },
      to: email,
      subject: "Login realizado com sucesso",
      html: `
          <div style="font-family: 'Arial', sans-serif; color: #333;">
            <h2>Olá 👋</h2>
            <p>Você realizou o login com sucesso no S-Commerce. 🎉</p>
            <p><strong>Detalhes do Acesso:</strong></p>
            <ul>
              <li><strong>País:</strong> ${response.data.country} 🌍</li>
              <li><strong>Estado:</strong> ${response.data.regionName} 📍</li>
              <li><strong>Cidade:</strong> ${response.data.city} 🏙️</li>
              <li><strong>Serviço de Provedor de Internet (ISP):</strong> ${response.data.isp} 🌐</li>
              <li><strong>Organização:</strong> ${response.data.org} 🏢</li>
              <li><strong>IP:</strong> ${response.data.query} 💻</li>
            </ul>
            <p>Se você não reconhece esse acesso, entre em contato conosco imediatamente. 🚨</p>
            <hr>
            <p>Atenciosamente,</p>
            <p><strong>Equipe S-Commerce</strong></p>
          </div>
        `,
    };

    try {
      const enviarEmail = await transporter.sendMail(mailOptions);
      console.log("Email enviado: ", enviarEmail.response);
    } catch (error) {
      console.log(error);
    }

    const hora = moment().format("HH:mm");

    const his = {
      Codcli: usuario.CodCli,
      Data: new Date(),
      Hora: hora,
      CodTrans: 1,
      CodUsu: 1,
      Historico: `Realizou login no Ecommerce através do IP: ${ip}`,
    };

    await db("Cli_His").insert(his).where("CodCli", usuario.CodCli);
    return res.status(200).json({ usuario: usuario, admin: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao realizar o login do usuário." });
  }
}

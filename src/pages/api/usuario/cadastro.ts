import db from "@/db/db"; // Ajuste o caminho conforme necessário
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import transporter from "@/services/nodeMailer";

interface ErrorResponse {
  error: string;
}

export default async function cadastrarUsuario(req: NextApiRequest, res: NextApiResponse<string | ErrorResponse>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const emailExistente = await db("clientes").where("email", req.body.email).select("email").first();

    if (emailExistente) {
      return res.status(400).json({ error: "Email já cadastrado no banco" });
    }

    const cnpjExiste = await db("clientes").where("cgc", req.body.cgc).select("cgc").first();

    if (cnpjExiste) {
      return res.status(400).json({ error: "CNPJ já cadastrado no banco, experimente recuperar a senha" });
    }

    const ultimoID = await db("clientes").select("CodCli").orderBy("CodCli", "desc").first();
    const { CodMun } = await db("municipio").select("CodMun").where("municipio", req.body.cidade).first();

    const dataFormatada = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss.SSS");

    const novoUsuario = {
      CodCli: ultimoID.CodCli + 1,
      ...req.body,
      DataCad: dataFormatada,
      CodPais: 1058,
      CodSeg: 0,
      Tipo: "J",
      Complemento: "ECOMMERCE",
      Situacao: "B",
      CodMun,
    };

    await db("clientes").insert(novoUsuario);
    const usuario = await db("Clientes").where("CodCli", novoUsuario.CodCli).select("Cliente", "Razao").first();

    if (usuario && usuario.Cliente.length <= 0 && usuario.Razao) {
      usuario.Cliente = usuario.Razao;
    }

    const tokenDeConfirmacao = uuidv4();
    await db("tokens_confirmacao").insert({
      token: tokenDeConfirmacao,
      CodCli: novoUsuario.CodCli,
      data_expiracao: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expira em 24 horas
    });

    const mailOptions = {
      from: {
        name: "Soft Line Sistemas",
        address: "softlinedocs@gmail.com",
      },
      to: novoUsuario.email,
      subject: "Confirme sua conta no S-Commerce",
      html: `
      <div style="font-family: 'Arial', sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #27ae60;">Quase lá, ${usuario.Cliente}! 🚀</h2>
        <p>Estamos emocionados por ter você conosco.</p>
        <p>Antes de começar a explorar o S-Commerce, precisamos que você confirme sua conta. Isso garante a segurança e a autenticidade do seu perfil.</p>
        <p>Clique no link abaixo para confirmar sua conta:</p>
        <a href="${process.env.URL}/criar-senha/${tokenDeConfirmacao}" style="color: #27ae60;">Confirmar Conta</a>
        <p>Após a confirmação, você poderá:</p>
        <ul>
          <li>Explorar uma ampla gama de produtos</li>
          <li>Gerenciar suas compras e pedidos</li>
          <li>Receber atualizações exclusivas e ofertas especiais</li>
        </ul>
        <p>Se tiver dúvidas ou precisar de ajuda, nossa equipe de suporte está à disposição.</p>
        <hr>
        <p>Atenciosamente,</p>
        <p><strong>Equipe Soft Line Sistemas</strong></p>
      </div>
    `,
    };

    try {
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(error);
          // Se ocorrer um erro ao enviar o e-mail, você pode lidar com ele aqui
        } else {
          console.log("E-mail enviado com sucesso:");
        }
      });
    } catch (error) {
      console.log(error);
    }

    return res.json("ok");
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ error: "Erro ao cadastrar o usuário" });
  }
}

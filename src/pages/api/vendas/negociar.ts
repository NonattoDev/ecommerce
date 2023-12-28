import db from "@/db/db";
import transporter from "@/services/nodeMailer";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { produtosNoCarrinho, session, valorFrete } = req.body;

    const dataAtual = moment().startOf("day"); // Zera horas, minutos, segundos e milissegundos

    const dataFormatada = dataAtual.format("YYYY-MM-DD HH:mm:ss.SSS");
    try {
      // 1. Obtenha a última venda
      let ultimaVenda = await db("numero").select("Venda").first();
      let valorAtualizado = ultimaVenda.Venda + 1; // Adicione 1 ao valor da última venda

      // 2. Atualize o valor da venda na tabela
      await db("numero").update({ Venda: valorAtualizado });

      // 3. Inserir em Requisi
      const inserirVendaRequisi = await db("requisi").insert({
        Pedido: valorAtualizado,
        Data: dataFormatada,
        //Tipo é pedido pois aqui nesse caso, a venda já foi autorizada pelo emissor do cartão e retornado pela PAGSEGURO
        Tipo: "PROPOSTA",
        CodCli: session.user.id,
        Observacao: "Esse cliente quer negociar uma venda vinda do Ecommerce, boa venda!",
        Frete: valorFrete,
        Tipo_Preco: 1,
        CodCon: 0,
        CodPros: 0,
        CodEmp: 1,
        Dimensao: 2,
        CodInd: 1,
        Status: "VENDA",
        FIB: valorFrete > 0 ? 0 : 9,
        Ecommerce: "X",
        Autorizacao: `E${valorAtualizado}`,
      });

      // 4. Inserir em Requisi1
      for (const item of produtosNoCarrinho) {
        await db("requisi1").insert({
          Pedido: valorAtualizado,
          CodPro: item.CodPro,
          qtd: item.Quantidade,
          preco: item.Preco1,
          preco1: item.Preco1,
          preco2: item.Preco1,
          Situacao: "000",
        });
      }

      const { email, Cliente } = await db("clientes").select("email", "Cliente").where("CodCli", session.user.id).first();

      const mailOptions = {
        from: {
          name: "S-Commerce",
          address: process.env.GMAIL_LOGIN as string,
        },
        to: email,
        subject: `Pedido de Proposta Recebido`,
        html: `
          <div style="font-family: 'Arial', sans-serif; color: #333;">
            <h2>Olá, ${Cliente}</h2>
            <p>Recebemos o seu interesse em negociar a proposta de número <strong>${valorAtualizado}</strong>.</p>
            <p>Aguarde e um dos nossos colaboradores entrará em contato com você.</p>
            <hr>
            <p>Atenciosamente,</p>
            <p><strong>Equipe SoftlineDocs</strong></p>
          </div>
        `,
      };

      try {
        const enviarEmail = await transporter.sendMail(mailOptions);
        console.log("Email enviado: ", enviarEmail.response);
      } catch (error) {
        console.log(error);
      }

      return res.json({ message: "Vendedor recebeu a Proposta", idProposta: valorAtualizado });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  }

  return res.status(405).end(); // Método não permitido se não for GET
}

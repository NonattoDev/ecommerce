import xml2js from "xml2js";
import db from "@/db/db";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { notificationCode, notificationType } = req.body;
  if (req.method === "POST") {
    if (notificationCode && notificationType) {
      let credenciais = {
        email: "robsonnonatoiii@gmail.com",
        token_api: "B871F6967C2341489D37924D761FF1BD",
      };

      const url = `https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${credenciais.email}&token=${credenciais.token_api}`;

      try {
        const response = await axios.get(url);

        // Converter o XML para um objeto JavaScript
        xml2js.parseString(response.data, async (err: any, result: any) => {
          if (err) {
            console.error("Erro ao converter o XML:", err);
            return;
          }

          // Colocar o Status em um campo, pois ele representa se a venda está paga ou aguardando pagamento, e mais 7 status
          console.log(result.transaction);

          const statusPagamento = result.transaction.status;
          const pedidoPAG = parseInt(result.transaction.reference[0]);

          // Colocando o Enterprise a ultima atualizacao de LOG.

          const insertLogOnRequisi = await db("requisi")
            .where("Pedido", pedidoPAG)
            .update({ Observacao: JSON.stringify(result.transaction), StatusPagamento: statusPagamento });
        });
        return res.json("Recebido e inserido no banco!");
      } catch (error) {
        console.log("Erro ao buscar detalhes da notificação:", error);
        return res.status(500).json("Erro ao processar notificação");
      }
    }
  }
}

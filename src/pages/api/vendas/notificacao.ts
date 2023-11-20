import xml2js from "xml2js";
import db from "@/db/db";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";

const parser = new xml2js.Parser(); // Usar a versão baseada em promessas

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "POST") {
    const { notificationCode, notificationType } = req.body;

    if (notificationCode && notificationType) {
      let credenciais = {
        email: "robsonnonatoiii@gmail.com",
        token_api: process.env.PAGSEGURO_TOKEN_API,
      };

      const url = `https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${credenciais.email}&token=${credenciais.token_api}`;

      try {
        const response = await axios.get(url);

        try {
          const result = await parser.parseStringPromise(response.data);

          const statusPagamentos: { [key: string]: string } = {
            "1": "Aguardando pagamento",
            "2": "Em análise",
            "3": "Paga",
            "4": "Disponível",
            "5": "Em disputa",
            "6": "Devolvida",
            "7": "Cancelada",
            "8": "Debitado",
            "9": "Retenção temporária", // ou qualquer outro status que represente
          };

          const statusPagamento = statusPagamentos[result.transaction.status[0]] || "Status desconhecido";
          const pedidoPAG = parseInt(result.transaction.reference[0]);
          const dataPag = moment(result.transaction.lastEventDate[0]).format("DD/MM/YYYY HH:mm:ss");

          await db("requisi")
            .where("Pedido", pedidoPAG)
            .update({ Observacao: JSON.stringify(result.transaction), StatusPagamento: statusPagamento, Pago: dataPag });

          return res.json({ message: "Recebido e inserido no banco!" });
        } catch (err) {
          console.error("Erro ao converter o XML:", err);
          return res.status(500).json({ message: "Erro ao processar o XML" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Erro ao processar notificação" });
      }
    } else {
      return res.status(400).json({ message: "Código ou tipo de notificação não fornecidos" });
    }
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Método não permitido");
  }
}

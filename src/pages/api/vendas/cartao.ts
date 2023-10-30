import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { Pagamento, CodCli } = req.body;

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
        Tipo: "PEDIDO",
        CodCli: CodCli,
        Observacao: Pagamento,
      });

      // 4. Inserir em Requisi1
      for (const item of Pagamento.items) {
        await db("requisi1").insert({
          Pedido: valorAtualizado,
          CodPro: parseInt(item.reference_id),
          qtd: parseInt(item.quantity),
          preco: parseInt(item.unit_amount),
        });
      }

      return res.status(200).json("Venda concluída no banco de dados");
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json("ok");
  }

  return res.status(405).end(); // Método não permitido se não for GET
}

import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { Pagamento, CodCli, valorFrete } = req.body;
    console.log(Pagamento);

    const dataAtual = moment().startOf("day"); // Zera horas, minutos, segundos e milissegundos

    const dataFormatada = dataAtual.format("YYYY-MM-DD HH:mm:ss.SSS");

    try {
      // 1. Obtenha a última venda
      let ultimaVenda = await db("numero").select("Venda").first();
      let valorAtualizado = ultimaVenda.Venda + 1; // Adicione 1 ao valor da última venda

      // 2. Atualize o valor da venda na tabela
      await db("numero").update({ Venda: valorAtualizado });

      // - Chamada no banco que pega o codigo referente ao pagamento em BOLETO

      const { CodCartao } = await db("empresa").select("CodCartao").where("CodEmp", 1).first();

      console.log(Pagamento);

      // 3. Inserir em Requisi
      const inserirVendaRequisi = await db("requisi").insert({
        Pedido: valorAtualizado,
        Data: dataFormatada,
        Tipo: "PEDIDO",
        CodCli: CodCli,
        Observacao: Pagamento,
        Tipo_Preco: 1, //
        CodCon: 0,
        CodPros: 0,
        CodEmp: 1,
        Dimensao: 2,
        CodInd: 1, //
        Status: "VENDA",
        FIB: valorFrete > 0 ? 0 : 9,
        Ecommerce: "X",
        Frete: valorFrete,
        CodForma1: CodCartao,
        Data1: moment().format("YYYY-MM-DD"),
        Parc1: Pagamento.charges[0].payment_method.installments,
        StatusPagamento: Pagamento.charges[0].status,
        CodAutorizacaoNumber: Pagamento.charges[0].payment_response.code,
        idStatus: Pagamento.id,
        idPagamento: Pagamento.charges[0].id,
        Pago: Pagamento.charges[0].paid_at,
        Bandeira: Pagamento.charges[0].payment_method.card.brand,
        PDigito: Pagamento.charges[0].payment_method.card.first_digits,
        UDigito: Pagamento.charges[0].payment_method.card.last_digits,
        Nome: Pagamento.charges[0].payment_method.card.holder.name,
      });

      // 4. Inserir em Requisi1
      for (const item of Pagamento.items) {
        await db.raw(`Update Produto set EstoqueReservado1 = EstoqueReservado1 + ${parseFloat(item.quantity)} Where CodPro = ${parseInt(item.reference_id)}`);
        await db("requisi1").insert({
          Pedido: valorAtualizado,
          CodPro: parseInt(item.reference_id),
          qtd: parseFloat(item.quantity),
          preco: parseFloat(item.unit_amount) / 100,
          preco1: item.Preco1,
          preco2: item.Preco1,
          Situacao: "000", //
          Marca: "*",
        });
      }

      return res.status(200).json({ message: "Venda concluída no banco de dados", idVenda: valorAtualizado });
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json("ok");
  }

  return res.status(405).end(); // Método não permitido se não for GET
}

import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/db";
import moment from "moment";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite que todas as origens acessem
  if (req.method === "POST") {
    try {
      let { dadosPessoais, dadosCartao, formattedProducts, totalAmount, endereco, parcelaSelecionada, CodCli, valorFrete } = req.body;

      //Tratando para mandar para a PAGSEGURO
      if (parcelaSelecionada === 0) {
        parcelaSelecionada = 1;
      }

      const CEPFormatado = endereco.CEP.replace(/\D/g, "");

      const telefone = dadosPessoais.telefone;
      const regex = /^\(?(?:(\d{2})\)?\s?)?(\d{5}-\d{4})$/;

      const match = telefone.match(regex);
      if (!match) {
        return res.status(400).json({ message: "Telefone inválido" });
      }

      const ddd = match[1];
      const numero = match[2].replace("-", ""); // Remover o hífen usando a função replace

      const cpfCNPJ = (dadosPessoais.cpfCnpj = dadosPessoais.cpfCnpj.replace(/\D+/g, ""));
      // 1. Obtenha a última venda
      let ultimaVenda = await db("numero").select("Venda").first();
      let valorAtualizado = ultimaVenda.Venda + 1; // Adicione 1 ao valor da última venda

      // 2. Atualize o valor da venda na tabela
      await db("numero").update({ Venda: valorAtualizado });

      const options = {
        method: "POST",
        url: "https://sandbox.api.pagseguro.com/orders",
        headers: {
          accept: "application/json",
          Authorization: "Bearer B871F6967C2341489D37924D761FF1BD",
          "content-type": "application/json",
        },
        data: {
          reference_id: "credito_card-00001",
          customer: {
            name: dadosPessoais.nomeCompleto,
            email: dadosPessoais.email,
            tax_id: cpfCNPJ,
            phones: [{ country: "55", area: ddd, number: numero, type: "MOBILE" }],
          },
          items: formattedProducts,
          shipping: {
            address: {
              street: endereco.Endereco,
              number: endereco.Numero,
              complement: endereco.ComplementoEndereco,
              locality: endereco.Bairro,
              city: endereco.Cidade,
              region_code: endereco.Estado,
              country: "BRA",
              postal_code: CEPFormatado,
            },
          },
          notification_urls: ["http://192.168.1.3:3001/pedido/notificacoespag"],
          charges: [
            {
              reference_id: valorAtualizado,
              description: "Teste API PagSeguro",
              amount: { value: Math.round(totalAmount * 100), currency: "BRL" },
              payment_method: {
                type: "CREDIT_CARD",
                installments: parcelaSelecionada,
                capture: true,
                card: {
                  number: dadosCartao.numeroCartao,
                  exp_month: dadosCartao.expMonth,
                  exp_year: dadosCartao.expYear,
                  security_code: dadosCartao.cvv,
                  holder: { name: dadosCartao.nomeCartao },
                  store: true,
                },
              },
            },
          ],
        },
      };

      const dataAtual = moment().startOf("day"); // Zera horas, minutos, segundos e milissegundos

      const dataFormatada = dataAtual.format("YYYY-MM-DD HH:mm:ss.SSS");

      const response = await axios.post(options.url, options.data, {
        headers: options.headers,
      });

      //! Se o Status é OK, ou seja, o cartao autorizou
      if (response.data.charges[0].payment_response.code === "20000") {
        // - Chamada no banco que pega o codigo referente ao pagamento em BOLETO
        const { CodCartao } = await db("empresa").select("CodCartao").where("CodEmp", 1).first();
        const Pagamento = await response.data;
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
          NSU: Pagamento.charges[0].payment_response.reference,
          CodigoRazao: Pagamento.charges[0].payment_response.code,
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
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }

    return res.status(200).json("ok");
  }

  return res.status(405).end(); // Método não permitido se não for GET
}
